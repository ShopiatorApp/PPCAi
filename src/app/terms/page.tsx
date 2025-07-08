'use client'

import { useState, useMemo } from 'react'
import { useSettings } from '@/lib/contexts/SettingsContext'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import type { SearchTermMetric, TabData } from '@/lib/types'
import { calculateAllSearchTermMetrics, type CalculatedSearchTermMetric } from '@/lib/metrics'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type SortField = keyof CalculatedSearchTermMetric
type SortDirection = 'asc' | 'desc'

type FilterState = {
    campaign: string
    adGroup: string
    minCost: string
    maxCost: string
    minClicks: string
    maxClicks: string
    minConv: string
    maxConv: string
}

export default function TermsPage() {
    const { settings, fetchedData, dataError, isDataLoading } = useSettings()
    const [sortField, setSortField] = useState<SortField>('cost')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const [filters, setFilters] = useState<FilterState>({
        campaign: 'all',
        adGroup: 'all',
        minCost: '',
        maxCost: '',
        minClicks: '',
        maxClicks: '',
        minConv: '',
        maxConv: ''
    })

    // --- Hooks called unconditionally at the top --- 
    const searchTermsRaw = useMemo(() => (fetchedData?.searchTerms || []) as SearchTermMetric[], [fetchedData]);

    // Calculate derived metrics for all terms using useMemo
    const calculatedSearchTerms = useMemo(() => {
        return calculateAllSearchTermMetrics(searchTermsRaw)
    }, [searchTermsRaw])

    // Get unique campaigns and ad groups for filters
    const uniqueCampaigns = useMemo(() => {
        return Array.from(new Set(calculatedSearchTerms.map(term => term.campaign))).sort()
    }, [calculatedSearchTerms])

    const uniqueAdGroups = useMemo(() => {
        return Array.from(new Set(calculatedSearchTerms.map(term => term.ad_group))).sort()
    }, [calculatedSearchTerms])

    // Apply filters
    const filteredTerms = useMemo(() => {
        return calculatedSearchTerms.filter(term => {
            if (filters.campaign !== 'all' && term.campaign !== filters.campaign) return false
            if (filters.adGroup !== 'all' && term.ad_group !== filters.adGroup) return false
            if (filters.minCost && term.cost < Number(filters.minCost)) return false
            if (filters.maxCost && term.cost > Number(filters.maxCost)) return false
            if (filters.minClicks && term.clicks < Number(filters.minClicks)) return false
            if (filters.maxClicks && term.clicks > Number(filters.maxClicks)) return false
            if (filters.minConv && term.conv < Number(filters.minConv)) return false
            if (filters.maxConv && term.conv > Number(filters.maxConv)) return false
            return true
        })
    }, [calculatedSearchTerms, filters])

    // Sort data (now using filtered terms)
    const sortedTerms = useMemo(() => {
        return [...filteredTerms].sort((a, b) => {
            const aVal = a[sortField]
            const bVal = b[sortField]
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal) * (sortDirection === 'asc' ? 1 : -1);
            }
            return (Number(aVal) - Number(bVal)) * (sortDirection === 'asc' ? 1 : -1)
        })
    }, [filteredTerms, sortField, sortDirection])

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearFilters = () => {
        setFilters({
            campaign: 'all',
            adGroup: 'all',
            minCost: '',
            maxCost: '',
            minClicks: '',
            maxClicks: '',
            minConv: '',
            maxConv: ''
        })
    }

    const activeFiltersCount = Object.values(filters).filter(Boolean).length

    // --- End of unconditional hooks ---

    // Handle loading and error states *after* hooks
    if (dataError) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-500 mb-4">Error loading data</div>
            </div>
        )
    }

    if (isDataLoading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    const handleSort = (field: SortField) => {
        const isStringField = ['search_term', 'campaign', 'ad_group'].includes(field);
        const defaultDirection = isStringField ? 'asc' : 'desc';

        if (field === sortField) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection(defaultDirection)
        }
    }

    const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
        <Button
            variant="ghost"
            onClick={() => handleSort(field)}
            className="h-8 px-2 lg:px-3 hover:bg-gray-100 transition-colors"
        >
            {children}
            {sortField === field && (
                <span className="ml-2">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </Button>
    )

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Search Terms</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Showing {sortedTerms.length} of {calculatedSearchTerms.length} records
                    </p>
                </div>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear all filters
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Campaign</label>
                        <Select value={filters.campaign} onValueChange={(value) => handleFilterChange('campaign', value)}>
                            <SelectTrigger className="max-w-[200px]">
                                <SelectValue placeholder="All campaigns" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All campaigns</SelectItem>
                                {uniqueCampaigns.map(campaign => (
                                    <SelectItem key={campaign} value={campaign}>
                                        {campaign}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ad Group</label>
                        <Select value={filters.adGroup} onValueChange={(value) => handleFilterChange('adGroup', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All ad groups" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All ad groups</SelectItem>
                                {uniqueAdGroups.map(adGroup => (
                                    <SelectItem key={adGroup} value={adGroup}>
                                        {adGroup}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cost Range</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minCost}
                                onChange={(e) => handleFilterChange('minCost', e.target.value)}
                                className="w-full"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxCost}
                                onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Clicks Range</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minClicks}
                                onChange={(e) => handleFilterChange('minClicks', e.target.value)}
                                className="w-full"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxClicks}
                                onChange={(e) => handleFilterChange('maxClicks', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Conversions Range</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minConv}
                                onChange={(e) => handleFilterChange('minConv', e.target.value)}
                                className="w-full"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxConv}
                                onChange={(e) => handleFilterChange('maxConv', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-3">
                    <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'none', minHeight: '400px' }}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 hover:bg-gray-100">
                                    <TableHead className="w-[200px] font-semibold text-gray-900">
                                        <SortButton field="search_term">Search Term</SortButton>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-900">
                                        <SortButton field="campaign">Campaign</SortButton>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-900">
                                        <SortButton field="ad_group">Ad Group</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="impr">Impr</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="clicks">Clicks</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="cost">Cost</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="conv">Conv</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="value">Value</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="CTR">CTR</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="CPC">CPC</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="CvR">CvR</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="CPA">CPA</SortButton>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">
                                        <SortButton field="ROAS">ROAS</SortButton>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTerms.map((term, i) => (
                                    <TableRow 
                                        key={`${term.search_term}-${term.campaign}-${term.ad_group}-${i}`}
                                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                    >
                                        <TableCell className="font-medium text-gray-900 text-sm">{term.search_term}</TableCell>
                                        <TableCell className="text-gray-700 text-sm">{term.campaign}</TableCell>
                                        <TableCell className="text-gray-700 text-sm">{term.ad_group}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatNumber(term.impr)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatNumber(term.clicks)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatCurrency(term.cost, settings.currency)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatNumber(term.conv)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatCurrency(term.value, settings.currency)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatPercent(term.CTR)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatCurrency(term.CPC, settings.currency)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatPercent(term.CvR)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">{formatCurrency(term.CPA, settings.currency)}</TableCell>
                                        <TableCell className="text-right text-gray-700 text-sm">
                                            {(term.ROAS && isFinite(term.ROAS)) ? `${term.ROAS.toFixed(2)}x` : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
} 