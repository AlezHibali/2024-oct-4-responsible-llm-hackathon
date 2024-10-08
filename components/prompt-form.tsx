'use client'
import ReactMarkdown from 'react-markdown';
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
import { BotMessage } from '@/components/stocks'

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
    if (!dbURL.trim()) return; // If the dbURL is empty, do nothing
  
    try {
      const response = await fetch('https://3.81.138.29:5000/api/set_db_link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ db_link: dbURL.trim() })
      });
  
      const result = await response.json();
  
      if (result.status === 'Connected') {
        const connectionMessage = {
          id: nanoid(),
          display: (
            <UserMessage>
              <ReactMarkdown>{`Database Connection Response: ${result.message}`}</ReactMarkdown>
            </UserMessage>
          )
        };
  
        setMessages(currentMessages => [...currentMessages, connectionMessage]);
  
        if (result.data && result.data.length > 0) {
          const dataMessage = {
            id: nanoid(),
            display: (
              <UserMessage>
                <ReactMarkdown>{`${JSON.stringify(result.data, null, 2).replace(/\\n/g, '\n')}`}</ReactMarkdown> {/* Using replace to handle newlines */}
              </UserMessage>
            )
          };
  
          setMessages(currentMessages => [...currentMessages, dataMessage]);
        } else {
          const noDataMessage = {
            id: nanoid(),
            display: (
              <UserMessage>
                <ReactMarkdown>{`No data found.`}</ReactMarkdown>
              </UserMessage>
            )
          };
  
          setMessages(currentMessages => [...currentMessages, noDataMessage]);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };
  
  

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