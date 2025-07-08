import { Card } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function MetricCard({ 
  label, 
  value, 
  isSelected, 
  onClick,
  className = ''
}: MetricCardProps) {
  return (
    <Card
      className={`
        p-3 transition-all bg-white
        ${onClick ? 'cursor-pointer hover:bg-gray-50 hover:ring-2 hover:ring-orange-500/50' : ''}
        ${isSelected ? 'ring-2 ring-orange-500' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="text-lg font-bold mt-0.5 text-gray-900 truncate">{value}</div>
    </Card>
  )
} 