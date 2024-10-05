'use client'
import ReactMarkdown from 'react-markdown';
import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { DatabaseIcon, Loader2 } from 'lucide-react'

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

  const [dbURL, setDbURL] = React.useState('')
  const [isConnected, setIsConnected] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)

  React.useEffect(() => {
    if (inputRef.current && isConnected) {
      inputRef.current.focus()
    }
  }, [isConnected])

  const handleDbSubmit = async () => {
    if (!dbURL.trim() || isConnecting) return;
  
    setIsConnecting(true);
    try {
      const response = await fetch('http://3.81.138.29:5000/api/set_db_link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ db_link: dbURL.trim() })
      });
  
      const result = await response.json();
  
      if (result.status === 'Connected') {
        setIsConnected(true);
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
                <ReactMarkdown>{`${JSON.stringify(result.data, null, 2).replace(/\\n/g, '\n')}`}</ReactMarkdown>
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
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }
        const value = input.trim()
        setInput('')
        if (!value) return
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
      className="flex flex-col space-y-4"
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        {isConnected ? (
          <>
            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              placeholder="Send a message."
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className="absolute right-0 top-4 sm:right-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" size="icon" disabled={input === ''}>
                    <IconArrowElbow />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[60px] text-gray-500">
            Please connect to the database to start chatting.
          </div>
        )}
      </div>
      
      {!isConnected && (
        <div className="flex items-center space-x-2">
          <DatabaseIcon className="text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Enter your database URL"
            className="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={dbURL}
            onChange={(e) => setDbURL(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleDbSubmit();
              }
            }}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleDbSubmit}
                className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Connect to Database</TooltipContent>
          </Tooltip>
        </div>
      )}
    </form>
  )
}