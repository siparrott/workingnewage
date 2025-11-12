import React from 'react';
import { Shield, Sparkles, Zap } from 'lucide-react';
import CRMOperationsAssistantV2 from '../../components/chat/CRMOperationsAssistantV2';

const AgentV2Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Agent V2 - Enhanced CRM Assistant
              </h1>
              <p className="text-gray-600 mt-1">
                Powered by ToolBus Architecture with Advanced Safety Features
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-violet-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-lg">Enhanced Safety</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Built-in guardrails with scope-based authorization and confirmation gates for all risky operations.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Smart Tool Execution</h3>
            </div>
            <p className="text-gray-600 text-sm">
              10 production-ready tools with Zod validation: search, create, update, email, calendar, and invoices.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg">Full Audit Trail</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Complete session logging with tool calls, arguments, results, and performance metrics.
            </p>
          </div>
        </div>

        {/* Safety Modes Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Safety Modes</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700 mb-1">Read-Only Mode</h4>
              <p className="text-sm text-gray-600">
                Only search and list operations. No modifications allowed.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-semibold text-amber-700 mb-1">Auto-Safe Mode (Default)</h4>
              <p className="text-sm text-gray-600">
                Medium-risk actions require confirmation. High-risk always confirm.
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-700 mb-1">Auto-Full Mode</h4>
              <p className="text-sm text-gray-600">
                High autonomy. Only high-risk actions require confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Available Tools */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Available Tools (10 Total)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Read-Only (Low Risk)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Search clients</li>
                <li>• List leads</li>
                <li>• List invoices</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Safe Writes (Medium Risk)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Draft email</li>
                <li>• Create calendar event</li>
                <li>• Update client info</li>
                <li>• Create invoice draft</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                High Risk (Always Confirm)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Send email</li>
                <li>• Send invoice via email</li>
                <li>• Mark invoice as paid</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-md p-6 text-white mb-8">
          <h3 className="font-semibold text-lg mb-3">How to Use</h3>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Click the chat button in the bottom-right corner to start a conversation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Ask the agent to perform tasks like "Search for client John Doe" or "Create an invoice for..."</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Review confirmation modals for medium and high-risk actions before they execute</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Check the Agent Console (coming soon) to view audit logs and session history</span>
            </li>
          </ol>
        </div>

        {/* Note about V1 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <strong>Note:</strong> This is Agent V2 with enhanced safety features. The legacy CRM Assistant (V1) remains available during the migration period.
        </div>
      </div>

      {/* Agent V2 Chat Component */}
      <CRMOperationsAssistantV2 useV2={true} />
    </div>
  );
};

export default AgentV2Page;
