
import { Container, Stack } from '@chakra-ui/react'
import Navbar from './Components/Navbar'
import TodoForm from './Components/TodoForm'
import TodoList from './Components/TodoList'


export const base_url = import.meta.env.MODE === "development" ? "http://localhost:3000/api/" : "/api"

const App = () => {

  return (
    <>
      <Stack height={"100vh"}>
        <Navbar />
        <Container>
          <TodoForm />
          <TodoList />
        </Container>
      </Stack>
    </>
  )
}

export default App