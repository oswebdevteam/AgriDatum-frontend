import React from 'react'
import { Download, Calendar, MapPin, Scale, Key, ExternalLink } from 'lucide-react'
import type { HarvestRecord } from '../types'

interface HarvestRecordsProps {
  records: HarvestRecord[]
  onDownload: () => void
}

const HarvestRecords: React.FC<HarvestRecordsProps> = ({ records, onDownload }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const viewTransaction = (txHash: string) => {
    window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank')
  }

  if (records.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Records Yet</h3>
        <p className="text-gray-600 mb-6">
          Your recorded harvests will appear here once you start using the system.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-900">
          Harvest Records
        </h2>
        <button
          onClick={onDownload}
          className="btn-secondary flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Records
        </button>
      </div>

      <div className="grid gap-6">
        {records.map((record) => (
          <div key={record.id} className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-primary-900">
                    {record.cropType} Harvest
                  </h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {record.weightKg} kg
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{record.plotLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(record.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Scale className="w-4 h-4" />
                    <span>{record.weightKg} kg</span>
                  </div>
                </div>

                {record.transactionHash && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Key className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Transaction:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono text-xs">
                      {record.transactionHash.slice(0, 12)}...{record.transactionHash.slice(-8)}
                    </code>
                    <button
                      onClick={() => viewTransaction(record.transactionHash!)}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                )}
              </div>
              
              {record.transactionHash && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">
                    On-Chain
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HarvestRecords