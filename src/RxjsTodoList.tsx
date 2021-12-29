import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getNextId } from './getNextId'
import { RenderCounter } from './RenderCounter'
import { IListItem } from './types'
import { listItems$ } from './rxjs/store'
import { subscribed } from './subscribed'
import { map } from 'rxjs'

interface TextInputProps {
  saveHandler: (label: string) => void
  blurHandler?: (label: string) => void
  initialValue?: string
  placeholder?: string
  className?: string
}
const TextInput = ({
  saveHandler,
  blurHandler,
  initialValue = '',
  placeholder = '',
  className = ''
}: TextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [])

  const [value, setValue] = useState(initialValue || '')

  const save = () => {
    setValue('')
    if (value.trim() === '') return
    saveHandler(value)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      save()
    }
  }

  return (
    <input
      ref={inputRef}
      className={`border-b-2 mb-[-2px] bg-transparent focus:outline-none focus:border-green-600 placeholder:italic placeholder:text-center ${className}`.trim()}
      type='text'
      placeholder={placeholder || ''}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onBlur={() => {
        if (!blurHandler) return
        blurHandler(value)
      }}
    />
  )
}

interface ListItemProps {
  id: IListItem['id']
  label: IListItem['label']
  completed?: IListItem['completed']
  completedHandler: (item: IListItem, completed: boolean) => void
  saveHandler: (item: IListItem) => void
  deleteHandler: (itemId: IListItem['id']) => void
}
const ListItem = memo(
  ({ id, label, completed, completedHandler, saveHandler, deleteHandler }: ListItemProps) => {
    const item = { id, label, completed }
    const [isEditing, setIsEditing] = useState(false)
    const toggleCompleted = () => completedHandler(item, !item.completed)
    const onCheckboxChange = () => toggleCompleted()
    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.target !== e.currentTarget) return
      if (e.key === 'Enter' || e.key === ' ') {
        toggleCompleted()
      }
    }
    const deleteListItem = () => {
      deleteHandler(item.id)
    }
    const startEditing = () => {
      if (item.completed) return
      setIsEditing(true)
    }
    const endEditing = useCallback(
      (newLabel: string) => {
        setIsEditing(false)
        saveHandler({ ...item, label: newLabel })
      },
      [item]
    )

    const bgColor = item.completed ? 'bg-slate-900' : 'bg-slate-700'
    const textColor = item.completed ? 'text-slate-600' : 'text-slate-400'

    return (
      <div
        tabIndex={0}
        className={`p-2 px-4 my-2 gap-x-2 flex flex-row items-center  ${bgColor} ${textColor} rounded-xl`}
        onKeyUp={onKeyUp}
      >
        <input
          className={`mr-2 shrink-0`}
          type='checkbox'
          onChange={onCheckboxChange}
          checked={!!item.completed}
        />
        {isEditing ? (
          <TextInput
            className='w-10 grow'
            saveHandler={endEditing}
            blurHandler={endEditing}
            initialValue={item.label}
            placeholder='type list item here'
          />
        ) : (
          <div className={`grow  ${item.completed ? 'line-through' : ''}`} onClick={startEditing}>
            {item.label}
          </div>
        )}
        {!item?.completed && (
          <button
            tabIndex={0}
            className={`w-4 h-4 p-3 flex items-center justify-center rounded-full hover:text-blue-600 hover:bg-blue-200`}
            onClick={startEditing}
          >
            &#9998;
          </button>
        )}
        <button
          className={`w-4 h-4 p-3 flex items-center justify-center rounded-full hover:text-red-600 hover:bg-red-200`}
          onClick={deleteListItem}
        >
          &times;
        </button>
        <RenderCounter />
      </div>
    )
  }
)

interface RxjsTodoListProps {
  listItems: IListItem[]
  addItems: (...items: IListItem[]) => void
  editItems: (...items: IListItem[]) => void
  deleteItems: (...itemIds: IListItem['id'][]) => void
}
export const PureTodoList = ({
  listItems,
  addItems,
  editItems,
  deleteItems
}: RxjsTodoListProps) => {
  const [counter, setCounter] = useState(0)
  const saveNewListItem = (label: string) => {
    addItems({ id: getNextId(), label })
  }
  const saveExistingListItem = editItems
  const completedHandler = useCallback(
    (item: IListItem, completed: boolean) => {
      editItems({ ...item, completed })
    },
    [editItems]
  )
  const deleteHandler = deleteItems
  return (
    <div className='container mx-auto gap-y-3 flex flex-col items-center'>
      <h2>Rxjs</h2>
      <button
        className='p-2 bg-blue-300 text-black rounded-md'
        onClick={() => setCounter(counter + 1)}
      >
        Re-Render Component ({counter})
      </button>
      <div className='p-5 w-72 max-w-xs flex flex-col bg-slate-800 shadow-lg rounded-xl'>
        {listItems &&
          listItems.map((item) => (
            <ListItem
              key={item.id}
              {...item}
              saveHandler={saveExistingListItem}
              completedHandler={completedHandler}
              deleteHandler={deleteHandler}
            />
          ))}
      </div>
      <RenderCounter />
      <TextInput saveHandler={saveNewListItem} placeholder='add list item here' />
    </div>
  )
}

export const RxjsTodoList = subscribed<{ listItems: IListItem[] }, RxjsTodoListProps>(
  listItems$.pipe(map((listItems) => ({ listItems }))),
  { listItems: listItems$.value },
  {
    props: {
      addItems: (...items: IListItem[]) => {
        listItems$.next(listItems$.value.concat(items))
      },
      editItems: (...newItems: IListItem[]) => {
        const items = [...listItems$.value]
        newItems
          .map((item) => ({ index: items.findIndex((i) => i.id === item.id), item }))
          .forEach(({ index, item }) => (items[index] = item))
          listItems$.next(items)
      },
      deleteItems: (...itemIds) => {
        listItems$.next(listItems$.value.filter((item) => !itemIds.includes(item.id)))
      }
    }
  }
)(PureTodoList)

export default RxjsTodoList
