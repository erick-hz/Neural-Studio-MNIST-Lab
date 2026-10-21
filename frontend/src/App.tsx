import { NavLink, Outlet } from 'react-router-dom'
import { Activity, BrainCircuit, CircleHelp, LayoutDashboard, PanelLeftClose, PencilRuler } from 'lucide-react'

const navigation = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/playground', label: 'Playground', icon: PencilRuler },
  { to: '/training', label: 'Training lab', icon: Activity },
]

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Neural Studio home"><span className="brand-mark"><BrainCircuit size={21} /></span><span>neural<span className="brand-light">studio</span><small>MNIST LAB</small></span></a>
        <div className="workspace-label">WORKSPACE <PanelLeftClose size={14} /></div>
        <nav aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => <NavLink aria-label={label} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} key={to} to={to} end={end}><Icon size={17} /><span>{label}</span>{label === 'Playground' && <span className="nav-indicator" />}</NavLink>)}
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-model"><span className="status-dot" /><div><strong>Digit classifier</strong><small>TensorFlow · Keras</small></div></div><a className="sidebar-help" href="http://localhost:8000/docs" target="_blank" rel="noreferrer"><CircleHelp size={16} />API reference</a><span className="sidebar-version">LOCAL INSTANCE <b>v1.0</b></span></div>
      </aside>
      <main className="main-area"><div className="topbar"><div><span className="crumb">PROJECT</span><span className="crumb-divider">/</span><strong>MNIST DIGIT RECOGNITION</strong></div><span className="api-live"><i />LOCAL API</span></div><Outlet /></main>
    </div>
  )
}