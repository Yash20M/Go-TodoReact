import { Button, Flex, Input, Spinner } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { IoMdAdd } from "react-icons/io"
import { base_url } from "../App"

const TodoForm = () => {
    const [newTodo, setNewTodo] = useState("")

    const queryClient = useQueryClient()
    const { mutate: createTodo, isPending } = useMutation({
        mutationKey: ["createTodo"],
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault()

            try {
                const res = await fetch(`${base_url}addTodo`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ body: newTodo })
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error("Failed to create todo")
                }

                setNewTodo("")
                return data || []

            } catch (err) {
                console.log(err)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
        onError: (error) => {
            alert(error.message)
        }

    })


    return (
        <form onSubmit={createTodo}>
            <Flex gap={2}>
                <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    ref={(input) => input && input.focus()}
                    placeholder="Add task here..."
                />
                <Button
                    mx={2}
                    type="submit"
                    _active={{
                        transform: "scale(.97)"
                    }}
                >
                    {isPending ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
                </Button>


            </Flex>
        </form>
    )
}

export default TodoForm