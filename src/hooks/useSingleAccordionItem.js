import { useState, useCallback } from 'react';

export const useSingleAccordionItem = (defaultActive = null) => {
  const [activeAccordionItem, setActiveAccordionItem] = useState(defaultActive); 
  
  const handleChange = useCallback(((id) => {
    id === activeAccordionItem ? setActiveAccordionItem(null) : setActiveAccordionItem(id);
  }), [setActiveAccordionItem, activeAccordionItem]);
   

  return {
    active: activeAccordionItem,
    onChange: handleChange,
  }
}