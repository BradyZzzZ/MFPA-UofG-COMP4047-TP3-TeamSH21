/**
 * Context for managing the side panel state and props
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { ResultSidePanelProps } from '@/components/ResultSidePanel/ResultSidePanel';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export enum SidePanelIndex {
  HISTORY = 'history_side_panel',
  DRAW = 'draw_side_panel',
  MANAGE_LAYERS = 'manage_layers_side_panel',
  IMPORT_PREVIEW = 'import_preview_side_panel',
  RESULT = 'result_side_panel',
}

const SidePanelDefaultValues: SidePanelContextType = {
  hidden: true,
  setHidden: () => {},
  index: SidePanelIndex.HISTORY,
  setIndex: () => {},
  resultSidePanelProps: {},
  setResultSidePanelProps: () => {},
};

export type SidePanelContextType = {
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  index: SidePanelIndex;
  setIndex: Dispatch<SetStateAction<SidePanelIndex>>;
  resultSidePanelProps: ResultSidePanelProps;
  setResultSidePanelProps: Dispatch<SetStateAction<ResultSidePanelProps>>;
};

export const SidePanelContext = createContext<SidePanelContextType>(
  SidePanelDefaultValues
);

export function useSidePanel() {
  return useContext(SidePanelContext);
}

type Props = {
  children: ReactNode;
};

export function SidePanelProvider({ children }: Props) {
  const [hidden, setHidden] = useState(true);
  const [index, setIndex] = useState(SidePanelIndex.HISTORY);
  const [resultSidePanelProps, setResultSidePanelProps] =
    useState<ResultSidePanelProps>({});

  const value: SidePanelContextType = {
    hidden,
    setHidden,
    index,
    setIndex,
    resultSidePanelProps,
    setResultSidePanelProps,
  };
  return (
    <>
      <SidePanelContext.Provider value={value}>
        {children}
      </SidePanelContext.Provider>
    </>
  );
}
