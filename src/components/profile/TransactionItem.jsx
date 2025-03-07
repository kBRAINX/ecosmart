'use client';

import { Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function TransactionItem({ transaction }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start">
        <div className={`mr-4 p-2 rounded-full ${
          transaction.type === 'earning'
            ? 'bg-green-100 text-green-600'
            : 'bg-orange-100 text-orange-600'
        }`}>
          {transaction.type === 'earning' ? (
            <Plus size={20} />
          ) : (
            <Minus size={20} />
          )}
        </div>

        <div>
          <p className="font-medium">
            {transaction.type === 'earning'
              ? `Gain: ${transaction.details || 'Activité'}`
              : `Retrait: ${transaction.method === 'wm1'
                  ? 'MTN Mobile Money'
                  : transaction.method === 'wm2'
                      ? 'Orange Money'
                      : 'Carte Bancaire'}`
            }
          </p>

          <p className="text-sm text-gray-500">
            {formatDate(transaction.timestamp)}
          </p>

          {transaction.reference && (
            <p className="text-xs text-gray-500 mt-1">
              Réf: {transaction.reference}
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className={`font-medium ${
          transaction.type === 'earning' ? 'text-green-600' : 'text-orange-600'
        }`}>
          {transaction.type === 'earning' ? '+' : '-'}{transaction.points} points
        </p>

        {transaction.amount > 0 && (
          <p className="text-sm">
            {transaction.amount.toLocaleString()} XAF
          </p>
        )}

        <Badge variant={
          transaction.status === 'completed'
            ? 'outline'
            : transaction.status === 'pending'
                ? 'secondary'
                : 'destructive'
        } className="mt-1">
          {transaction.status === 'completed'
            ? 'Complété'
            : transaction.status === 'pending'
                ? 'En attente'
                : 'Échoué'}
        </Badge>
      </div>
    </div>
  );
}
