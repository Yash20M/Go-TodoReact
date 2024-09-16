import { Badge, Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react"
import { FaCheckCircle } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { Todo } from "./TodoList"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { base_url } from "../App"

const TodoItem = ({ todo }: { todo: Todo }) => {

    const queryClient = useQueryClient()
    const { mutate: updateTodo, isPending: isUpdating } = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async () => {
            if (todo.completed) return alert("Todo is already completed")

            try {
                const res = await fetch(`${base_url}todos/${todo._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                })

                const data = await res.json()

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

                console.log("Udpate", data)
                return data || []
            }
            catch (err) {
                console.log(err)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] },)
        }
    })


    const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteTodo"],
        mutationFn: async () => {
            if (!todo.completed) {
                alert("Cannot delete until its completed")
                return
            }

            try {
                const res = await fetch(`${base_url}todos/${todo._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                })

                const data = await res.json()

                if (!res.ok) {
                    alert("Something went wrong.Please try again")
                }

                return data || []
            }
            catch (err) {
                console.log(err);

            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] },)
        }
    })


    return (
        <Flex gap={2} alignItems={"center"}>
            <Flex
                flex={1}
                alignItems={"center"}
                border={"1px"}
                borderColor={"grap.600"}
                p={2}
                borderRadius={"lg"}
                justifyContent={"space-between"}
            >
                <Text
                    color={todo.completed
                        ? "green"
                        : useColorModeValue("black", "yellow.100")}
                    textDecoration={todo.completed ? "line-through" : "none"}
                >{todo.body}</Text>
                {
                    todo.completed && (
                        <Badge ml={1} colorScheme="green">Done</Badge>
                    )
                }
                {!todo.completed &&
                    <Badge ml={1} colorScheme="yellow">
                        In Progress
                    </Badge>
                }
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Box color={"green.500"}
                    cursor={"pointer"}
                    onClick={() => updateTodo()}>
                    {
                        !isUpdating ?
                            <FaCheckCircle size={20} color="green" /> : <Spinner size={"sm"} />
                    }

                </Box>

                <Box color={"gree.500"} cursor={"pointer"} onClick={() => deleteTodo()} >
                    {
                        isDeleting ? <Spinner size={"sm"} /> :
                            <MdDelete size={25} color="red" />
                    }
                </Box>

            </Flex>
        </Flex>
    )
}

export default TodoItem