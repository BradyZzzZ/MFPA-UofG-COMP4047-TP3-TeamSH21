/**
 * Render the side panel based on the current side panel index.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import {
  DrawSidePanel,
  HistorySidePanel,
  ImportPreviewSidePanel,
  ManageLayersSidePanel,
  ResultSidePanel,
} from '@/components';
import { SidePanelIndex, useSidePanel } from '@/context';

const SidePanel = () => {
  const { index, resultSidePanelProps } = useSidePanel();
  switch (index) {
    case SidePanelIndex.HISTORY: {
      return <HistorySidePanel />;
    }
    case SidePanelIndex.DRAW: {
      return <DrawSidePanel />;
    }
    case SidePanelIndex.MANAGE_LAYERS: {
      return <ManageLayersSidePanel />;
    }
    case SidePanelIndex.IMPORT_PREVIEW: {
      return <ImportPreviewSidePanel />;
    }
    case SidePanelIndex.RESULT: {
      return <ResultSidePanel {...resultSidePanelProps} />;
    }
    default: {
      return <HistorySidePanel />;
    }
  }
};

export default SidePanel;
