import {createContext, useContext, useState, useEffect} from 'react';
import * as React from 'react'
import {useParams} from "react-router";
import axios from "axios";
import {API_BASE_URL} from "@/constants.tsx";
import {Resource} from "@/types/resource.tsx"

type ResourceProviderState = {
  resource: Resource | undefined,
  setResource: React.Dispatch<React.SetStateAction<Resource | undefined>>
}

const initialState: ResourceProviderState = {
  resource: undefined,
  setResource: () => null,
}

const ResourceContext = createContext<ResourceProviderState>(initialState);


export const useResource = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResource must be used within a ResourceProvider');
  }
  return context;
};

export const ResourceProvider = ({children, ...props}: { children: React.ReactNode }) => {
  const {namespace, resourceId} = useParams();
  const [resource, setResource] = useState<Resource | undefined>();

  useEffect(() => {
    if (resourceId) {
      axios.get(`${API_BASE_URL}/resources/${resourceId}`).then(response => {
        setResource(response.data);
      }).catch(error => {
        console.error(error);
      })
    }
  }, [namespace, resourceId]);

  const value = {resource, setResource}

  return (
    <ResourceContext.Provider {...props} value={value}>
      {children}
    </ResourceContext.Provider>
  );
};
