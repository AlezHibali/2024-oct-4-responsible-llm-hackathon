import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatabaseIcon } from 'lucide-react';

export default function EnhancedDBConnectionUI({ dbURL, setDbURL, handleDbSubmit, onKeyDown }) {
  return (
    <div className="relative mt-4 flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <DatabaseIcon className="text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Enter your database URL"
          className="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={dbURL}
          onChange={(e) => setDbURL(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDbSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Connect
            </Button>
          </TooltipTrigger>
          <TooltipContent>Connect to Database</TooltipContent>
        </Tooltip>
      </div>
      <p className="text-xs text-gray-500 italic">
        Enter the URL of your database to establish a connection.
      </p>
    </div>
  );
}