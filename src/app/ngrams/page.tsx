'use client'

import { useState, useMemo } from 'react'
import { useSettings } from '@/lib/contexts/SettingsContext'
import { analyzeNgrams } from '@/lib/metrics'
import { NgramAnalysis } from '@/components/NgramAnalysis'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

// Utility functions
const getCurrencyCode = (symbol: string): string => {
    const currencyMap: { [key: string]: string } = {
        '$': 'USD',
        '£': 'GBP',
        '€': 'EUR',
        '₹': 'INR',
        '¥': 'JPY'
    }
    return currencyMap[symbol] || 'USD' // Default to USD if symbol not found
}

const formatCurrency = (value: number, currency: string) => {
    const currencyCode = getCurrencyCode(currency)
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value)
}

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value)
}

type FilterState = {
    minCost: string
    maxCost: string
    minClicks: string
    maxClicks: string
    minConv: string
    maxConv: string
}

export default function NgramsPage() {
    const { settings, fetchedData, dataError, isDataLoading } = useSettings()
    const [ngramSize, setNgramSize] = useState(2)
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        minCost: '',
        maxCost: '',
        minClicks: '',
        maxClicks: '',
        minConv: '',
        maxConv: ''
    })

    // Calculate ngrams
    const ngrams = useMemo(() => {
        return analyzeNgrams(fetchedData?.searchTerms || [], ngramSize)
    }, [fetchedData?.searchTerms, ngramSize])

    // Apply filters
    const filteredNgrams = useMemo(() => {
        return ngrams.filter(ngram => {
            if (filters.minCost && ngram.totalCost < Number(filters.minCost)) return false
            if (filters.maxCost && ngram.totalCost > Number(filters.maxCost)) return false
            if (filters.minClicks && ngram.totalClicks < Number(filters.minClicks)) return false
            if (filters.maxClicks && ngram.totalClicks > Number(filters.maxClicks)) return false
            if (filters.minConv && ngram.totalConv < Number(filters.minConv)) return false
            if (filters.maxConv && ngram.totalConv > Number(filters.maxConv)) return false
            return true
        })
    }, [ngrams, filters])

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearFilters = () => {
        setFilters({
            minCost: '',
            maxCost: '',
            minClicks: '',
            maxClicks: '',
            minConv: '',
            maxConv: ''
        })
    }

    const activeFiltersCount = Object.values(filters).filter(Boolean).length

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

    return (
        <div className="container mx-auto px-4 py-6 mt-12">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">Ngram Analysis</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Ngram Size:</span>
                        <Select value={ngramSize.toString()} onValueChange={(v) => setNgramSize(Number(v))}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 word</SelectItem>
                                <SelectItem value="2">2 words</SelectItem>
                                <SelectItem value="3">3 words</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Clear all
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600">Total Ngrams</div>
                    <div className="text-2xl font-semibold mt-1">{filteredNgrams.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600">Total Cost</div>
                    <div className="text-2xl font-semibold mt-1">
                        {formatCurrency(filteredNgrams.reduce((sum, n) => sum + n.totalCost, 0), settings.currency)}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600">Total Clicks</div>
                    <div className="text-2xl font-semibold mt-1">
                        {formatNumber(filteredNgrams.reduce((sum, n) => sum + n.totalClicks, 0))}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600">Total Conversions</div>
                    <div className="text-2xl font-semibold mt-1">
                        {formatNumber(filteredNgrams.reduce((sum, n) => sum + n.totalConv, 0))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <NgramAnalysis ngrams={filteredNgrams} currency={settings.currency} />
            </div>
        </div>
    )
} 