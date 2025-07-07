import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Register from './pages/Register'
import Login from './pages/Login'

import UserManagement from './pages/Admin/userManagement'
import MoveManagement from './pages/Admin/MoveManagement'
import PokemonManagement from './pages/Admin/PokemonManagement'
import ItemManagement from './pages/Admin/ItemManagement'
import TypeManagement from './pages/Admin/TypeManagement'
import TeamsManagement from './pages/Admin/TeamsManagement'

import UserDashboard from './pages/User/UserDashboard'
import TeamPokemonManagement from './pages/User/TeamPokemonManagement'
import ModifyPokemonFromTeam from './pages/User/ModifyPokemonFromTeam'


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />

          <Route path="/admin" element={<UserManagement/>} />
          <Route path="/admin/moveManagement" element={<MoveManagement/>} />
          <Route path="/admin/pokemonManagement" element={<PokemonManagement/>} />
          <Route path='/admin/itemManagement' element={<ItemManagement/>} />
          <Route path='/admin/typeManagement' element={<TypeManagement/>} />
          <Route path='/admin/teamsManagement' element={<TeamsManagement/>} />

          {/* User Routes */}


          <Route path="/userDashboard" element={<UserDashboard/>} />
          <Route path="/userDashboard/teamPokemonManagement/:teamId" element={<TeamPokemonManagement/>} />
          <Route path="/teamPokemonManagement/modifyPokemon/:pokemonId" element={<ModifyPokemonFromTeam/>} />

          
          {/* Default Route */}

        </Routes>
      </AuthProvider>
    </Router>

  )
}

export default App
