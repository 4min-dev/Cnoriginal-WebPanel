import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { BrowserRouter } from 'react-router-dom'
import AsidePanel from './ui/aside/AsidePanel.tsx'
import { SidebarProvider } from './context/SidebarContext.tsx'
import { PaymentProvider } from './context/PaymentContext.tsx'
import MobileHeader from './ui/MobileHeader.tsx'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
      <PaymentProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              <AsidePanel />
              <div className="flex-1 overflow-auto">
                <div className='flex flex-col'>
                  <MobileHeader />
                  <App />
                </div>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </PaymentProvider>
    </Provider>
  </StrictMode>,
)
