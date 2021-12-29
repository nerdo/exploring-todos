import { useCallback, useEffect, useRef, useState } from 'react'
import { getCopyOfDefaults } from './defaults'
import { getNextId } from './getNextId'
import { RenderCounter } from './RenderCounter'
import { IListItem as ListItemEntry } from './types'

const { defaultListItems } = getCopyOfDefaults()

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
  item: ListItemEntry
  completedHandler: (completed: boolean) => void
  saveHandler: (item: ListItemEntry) => void
  deleteHandler: () => void
}
const ListItem = ({ item, completedHandler, saveHandler, deleteHandler }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const toggleCompleted = () => completedHandler(!item.completed)
  const onCheckboxChange = () => toggleCompleted()
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      toggleCompleted()
    }
  }
  const deleteListItem = useCallback(() => {
    deleteHandler()
  }, [deleteHandler])
  const startEditing = useCallback(() => {
    if (item.completed) return
    setIsEditing(true)
  }, [])
  const endEditing = (newLabel: string) => {
    setIsEditing(false)
    saveHandler({ ...item, label: newLabel })
  }

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

export const VanillaTodoList = () => {
  const [counter, setCounter] = useState(0)
  const [listItems, setListItems] = useState(defaultListItems)
  const saveNewListItem = (label: string) => {
    setListItems([...listItems, { id: getNextId(), label }])
  }
  const saveExistingListItem = (item: ListItemEntry) => {
    const index = listItems.findIndex((i) => i.id === item.id)
    const newListItems = [...listItems]
    newListItems[index] = { ...item }
    setListItems(newListItems)
  }

  return (
    <div className='container mx-auto gap-y-3 flex flex-col items-center'>
      <h2>Vanilla</h2>
      <button className='p-2 bg-blue-300 text-black rounded-md' onClick={() => setCounter(counter + 1)}>Re-Render Component ({counter})</button>
      <div className='p-5 w-72 max-w-xs flex flex-col bg-slate-800 shadow-lg rounded-xl'>
        {listItems &&
          listItems.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              saveHandler={saveExistingListItem}
              completedHandler={(completed) => {
                const newListItems = [...listItems]
                newListItems[index].completed = completed
                setListItems(newListItems)
              }}
              deleteHandler={() => {
                const newListItems = [...listItems]
                newListItems.splice(index, 1)
                setListItems(newListItems)
              }}
            />
          ))}
      </div>
      <RenderCounter />
      <TextInput saveHandler={saveNewListItem} placeholder='add list item here' />
    </div>
  )
}

export default VanillaTodoList
