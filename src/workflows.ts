export interface ToolWorkflow {
  id: string
  name: string
  description: string
  steps: { toolId: string; label: string }[]
}

/**
 * Product workflows connect adjacent ToolsKit actions so users can finish
 * multi-step jobs without returning to search after every step.
 */
export const workflows: ToolWorkflow[] = [
  {
    id: 'json-pipeline',
    name: 'JSON data pipeline',
    description: 'Clean, validate, compact, then convert JSON for the next system or file.',
    steps: [
      { toolId: 'json-formatter', label: 'Format' },
      { toolId: 'json-validator', label: 'Validate' },
      { toolId: 'json-minifier', label: 'Minify' },
      { toolId: 'json-csv', label: 'JSON → CSV' },
      { toolId: 'json-yaml', label: 'JSON → YAML' },
    ],
  },
  {
    id: 'pdf-publishing',
    name: 'PDF publishing',
    description: 'Assemble pages, arrange them, add a watermark, then reduce the output for sharing.',
    steps: [
      { toolId: 'merge-pdf', label: 'Merge' },
      { toolId: 'split-pdf', label: 'Split' },
      { toolId: 'reorder-pdf-pages', label: 'Reorder' },
      { toolId: 'rotate-pdf', label: 'Rotate' },
      { toolId: 'watermark-pdf', label: 'Watermark' },
      { toolId: 'compress-pdf', label: 'Compress' },
    ],
  },
  {
    id: 'image-ready',
    name: 'Image ready for web',
    description: 'Crop the source, resize it, compress it, then choose the format you need.',
    steps: [
      { toolId: 'image-cropper', label: 'Crop' },
      { toolId: 'image-resizer', label: 'Resize' },
      { toolId: 'image-compressor', label: 'Compress' },
      { toolId: 'image-converter', label: 'Convert' },
    ],
  },
  {
    id: 'text-cleanup',
    name: 'Text cleanup',
    description: 'Normalize pasted text before sorting it and checking the final size.',
    steps: [
      { toolId: 'extra-spaces', label: 'Clean spaces' },
      { toolId: 'line-break-remover', label: 'Join lines' },
      { toolId: 'duplicate-lines', label: 'Remove duplicates' },
      { toolId: 'text-sorter', label: 'Sort' },
      { toolId: 'word-counter', label: 'Check length' },
    ],
  },
  {
    id: 'developer-encoding',
    name: 'Developer encoding',
    description: 'Transform payload text between common transport and debugging formats.',
    steps: [
      { toolId: 'base64', label: 'Base64' },
      { toolId: 'url-encoder', label: 'URL encode' },
      { toolId: 'jwt-decoder', label: 'Inspect JWT' },
      { toolId: 'text-to-binary', label: 'Binary' },
    ],
  },
]

export function getPrimaryWorkflowForTool(toolId: string): ToolWorkflow | undefined {
  return workflows.find(workflow => workflow.steps.some(step => step.toolId === toolId))
}