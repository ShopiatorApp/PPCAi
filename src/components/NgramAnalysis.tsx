import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import type { NgramMetric } from '@/lib/metrics'

interface NgramAnalysisProps {
  ngrams: NgramMetric[]
  currency: string
}

export function NgramAnalysis({ ngrams, currency }: NgramAnalysisProps) {
  const [sortField, setSortField] = useState<keyof NgramMetric>('totalCost')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedNgrams = [...ngrams].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    return (Number(aVal) - Number(bVal)) * (sortDirection === 'asc' ? 1 : -1)
  })

  const handleSort = (field: keyof NgramMetric) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngram</TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('count')}>
              Count
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('totalCost')}>
              Cost
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('totalClicks')}>
              Clicks
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('totalImpr')}>
              Impressions
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('totalConv')}>
              Conversions
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('totalValue')}>
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNgrams.map((ngram) => (
            <TableRow key={ngram.ngram}>
              <TableCell className="font-medium">{ngram.ngram}</TableCell>
              <TableCell className="text-right">{formatNumber(ngram.count)}</TableCell>
              <TableCell className="text-right">{formatCurrency(ngram.totalCost, currency)}</TableCell>
              <TableCell className="text-right">{formatNumber(ngram.totalClicks)}</TableCell>
              <TableCell className="text-right">{formatNumber(ngram.totalImpr)}</TableCell>
              <TableCell className="text-right">{formatNumber(ngram.totalConv)}</TableCell>
              <TableCell className="text-right">{formatCurrency(ngram.totalValue, currency)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 