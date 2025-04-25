import React from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { Button } from "@/components/ui/button"
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.setAttribute('download', `knowledge-graph-${timestamp}.png`);
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton({ disabled = true}) {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
    
    const element = document.querySelector('.react-flow__viewport');
    if (element instanceof HTMLElement && element !== null) {
        toPng(element, {
            backgroundColor: '#ffffff',
            width: imageWidth,
            height: imageHeight,
            style: {
              width: String(imageWidth),
              height: String(imageHeight),
              transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
          }).then(downloadImage);
    }
  };

  return (
    <Button 
      onClick={onClick}
      variant="secondary"
      size="sm"
      disabled={disabled}
      className="shadow-md flex items-center gap-1"
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
      Download PNG
    </Button>
  );
}

export default DownloadButton;