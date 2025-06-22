export interface Label {
  label?: string
  span: {
    offset: number
    length: number
    line: number
    column: number
  }
}

export interface Message {
  message: string
  code: string
  severity: string
  causes: any[]
  url: string
  help: string
  filename: string
  labels: Label[]
  related: any[]
}

export interface LineData {
  line: number
  messages: Message[]
}

export interface FileData {
  filename: string
  source: string
  lines: LineData[]
}

export interface Summary {
  number_of_files: number
  threads_count: number
  start_time: number
}

export interface PayloadData {
  version: string
  config: object | null
  summary?: Summary
  files?: FileData[]
}
