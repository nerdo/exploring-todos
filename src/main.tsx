import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { VanillaTodoList } from './VanillaTodoList'
import { RxjsTodoList } from './RxjsTodoList'
import { MemoizedTodoList } from './MemoizedTodoList'
import { PureVanillaTodoList } from './PureVanillaTodoList'
import { getCopyOfDefaults } from './defaults'
import { ReduxTodoList } from './ReduxTodoList'
import { Provider } from 'react-redux'
import { store } from './redux/store'

const { defaultListItems } = getCopyOfDefaults()

const PureVanillaWrapper = () => {
  const [listItems, setListItems] = React.useState(defaultListItems)
  return <PureVanillaTodoList listItems={listItems} setListItems={setListItems} />
}

const MemoizedWrapper = () => {
  const [listItems, setListItems] = React.useState(defaultListItems)
  return <MemoizedTodoList listItems={listItems} setListItems={setListItems} />
}

const routes = [
  { to: '/vanilla', label: 'Vanilla', render: () => <VanillaTodoList /> },
  { to: '/pure-vanilla', label: 'Pure Vanilla', render: () => <PureVanillaWrapper /> },
  { to: '/memoized', label: 'Memoized', render: () => <MemoizedWrapper /> },
  { to: '/rxjs', label: 'RxJS', render: () => <RxjsTodoList /> },
  {
    to: '/redux',
    label: 'Redux',
    render: () => (
      <Provider store={store}>
        <ReduxTodoList />
      </Provider>
    )
  }
]
ReactDOM.render(
  <BrowserRouter>
    <div className='flex my-10'>
      <div className='m-auto flex flex-col justify-center gap-y-2 items-center'>
        <h1>Todos!</h1>
        <nav className='inline-flex flex-row'>
          {routes &&
            routes.map((route) => (
              <Link
                key={route.to}
                to={route.to}
                className='px-4 py-1 bg-slate-400 rounded-full text-slate-700 hover:text-white mr-2'
              >
                {route.label}
              </Link>
            ))}
        </nav>
        <main>
          <Routes>
            {routes &&
              routes.map((route) => (
                <Route key={route.to} path={route.to} element={route.render()} />
              ))}
          </Routes>
        </main>
      </div>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
)
