'use client'

import { useMemo } from 'react'
import { usePDF } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import { buildProgramPDF } from '@/lib/pdf'

export default function ProgramDownloadButton({ programText }: { programText: string }) {
  const doc = useMemo(() => buildProgramPDF(programText), [programText])
  const [instance] = usePDF({ document: doc })

  return (
    <a
      href={instance.url ?? '#'}
      download="my-fitness-program.pdf"
      onClick={instance.loading ? (e) => e.preventDefault() : undefined}
      className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-orange-500 hover:bg-orange-400 px-5 py-3 transition-colors group no-underline"
    >
      <Download className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
      <span className="font-bold text-white text-sm">
        {instance.loading ? 'Preparing PDF…' : 'Download Program PDF'}
      </span>
    </a>
  )
}
