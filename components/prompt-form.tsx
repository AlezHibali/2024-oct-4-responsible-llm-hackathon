'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconExternalLink, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  // State to store the database URL
  const [dbURL, setDbURL] = React.useState('')

  // Focus the input field on mount
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Function to handle submitting the database URL
  const handleDbSubmit = async () => {
    if (!dbURL.trim()) return // If the dbURL is empty, do nothing

    try {
      // Send a POST request to the backend endpoint with the dbURL
      const response = await fetch('http://3.81.138.29:5000/api/set_db_link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ db_link: dbURL.trim() })
      })

      if (!response.ok) {
        console.error('Failed to set DB link') // Log an error if the request fails
      } else {
        console.log('DB link set successfully') // Log success if the request succeeds
        console.log('show the response message', response.text())
      }
    } catch (error) {
      console.error('Error:', error) // Log any network or other errors
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile devices for better UX
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim() // Get the trimmed value of the input
        setInput('') // Clear the input field
        if (!value) return // If the input is empty, do nothing

        // Optimistically add user message UI before awaiting response
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(), // Generate a unique ID for the message
            display: <UserMessage>{value}</UserMessage> // Display the user message
          }
        ])

        // Submit the user message and get the response
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage]) // Add the response message to the messages
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new') // Navigate to the new chat page
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span> {/* Screen reader text for accessibility */}
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown} // Handle enter key to submit
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)} // Update input state when user types
        />
        <Textarea
          tabIndex={0}
          onKeyDown={onKeyDown} // Handle enter key to submit
          placeholder="Connect your database"
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="db_link"
          rows={1}
          value={dbURL}
          onChange={e => setDbURL(e.target.value)} // Update dbURL state when user types
        />
        <div className="absolute right-0 top-[50px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <input
                type="button"
                value="Submit"
                onClick={handleDbSubmit} // Handle the DB URL submission
                className="cursor-pointer border px-4 py-2 rounded-md"
              />
            </TooltipTrigger>
            <TooltipContent>Connect DB</TooltipContent>
          </Tooltip>
        </div>

        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}> {/* Disable the button if input is empty */}
                <IconArrowElbow />
                <span className="sr-only">Send message</span> {/* Screen reader text for accessibility */}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}