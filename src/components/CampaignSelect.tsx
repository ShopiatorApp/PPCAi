import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Campaign } from '@/lib/types'
import { useSettings } from '@/lib/contexts/SettingsContext'
import { formatCurrency } from '@/lib/utils'

interface CampaignSelectProps {
  campaigns: Campaign[]
  selectedId?: string
  onSelect: (id: string) => void
}

export function CampaignSelect({ campaigns, selectedId, onSelect }: CampaignSelectProps) {
  const { settings } = useSettings()

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Select Campaign:</span>
      <Select value={selectedId || 'all'} onValueChange={onSelect}>
        <SelectTrigger className="max-w-[240px]">
          <SelectValue placeholder="All campaigns" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All campaigns</SelectItem>
          {campaigns.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id}>
              {campaign.name} ({formatCurrency(campaign.totalCost, settings.currency)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 