import React, { useState } from 'react';
import { Save, RefreshCw, Star, Users, DollarSign, CreditCard, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaMoneyBill } from 'react-icons/fa';

interface PricingConfigProps {
  pricing: any;
  onSave: (pricing: any) => Promise<void>;
  onUploadSignature: (file: File) => Promise<string>;
}

interface FieldConfig {
  key: string;
  label: string;
  prefix?: boolean;
  suffix?: string | null;
  getValue: (p: any) => number;
  transform: (v: number) => number;
  hint: string;
}

const PlanCard = ({ title, icon: Icon, color, planKey, fields, localPricing, onChange }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${color.gradient}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 ${color.bg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{color.description}</p>
        </div>
      </div>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {fields.map((field: FieldConfig) => {
        const val = field.getValue(localPricing);
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
            <div className="relative">
              {field.prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              )}
              <input
                type="number"
                required
                value={val === 0 && localPricing[field.key] === "" ? "" : val}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  if (rawValue === "") {
                    onChange(field.key, "");
                  } else {
                    onChange(field.key, field.transform(Number(rawValue)));
                  }
                }}
                className={`w-full px-4 py-2 ${field.prefix ? 'pl-7' : ''} border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#04477E] focus:border-transparent`}
              />
              {field.suffix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{field.suffix}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">{field.hint}</p>
            {field.key.includes('AiDiscount') && localPricing?.guestAi && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-1">Price Preview</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Discounted AI Price:</span>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    ₹{Math.round((localPricing.guestAi / 100) * (1 - (Number(val) || 0) / 100))}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="md:col-span-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Razorpay Plan ID</label>
        <input 
          type="text" 
          readOnly 
          disabled
          value={localPricing?.[`${planKey}PlanId`] || 'Will be generated on save...'} 
          className="w-full px-4 py-2 border border-amber-100 dark:border-amber-900/30 rounded-xl bg-amber-50/20 dark:bg-amber-900/10 font-mono text-xs text-amber-700 dark:text-amber-500 cursor-not-allowed opacity-80" 
        />
      </div>
    </div>
  </div>
);

const configFields = {
  freelancer: [
    { key: 'freelancerPrice', label: 'Price (₹)', prefix: true, suffix: null, getValue: (p: any) => p?.freelancerPrice === "" ? "" : (p?.freelancerPrice / 100 || 0), transform: (v: number) => Math.round(v * 100), hint: 'Amount charged for subscription' },
    { key: 'freelancerDurationMonths', label: 'Duration (Months)', prefix: false, suffix: 'months', getValue: (p: any) => p?.freelancerDurationMonths === "" ? "" : (p?.freelancerDurationMonths || 0), transform: (v: number) => v, hint: 'Subscription validity period' },
    { key: 'freelancerResumeLimit', label: 'Resume Limit', prefix: false, suffix: 'resumes', getValue: (p: any) => p?.freelancerResumeLimit === "" ? "" : (p?.freelancerResumeLimit || 0), transform: (v: number) => v, hint: 'Maximum resumes allowed' },
    { key: 'freelancerAiDiscount', label: 'AI Discount (%)', prefix: false, suffix: '%', getValue: (p: any) => p?.freelancerAiDiscount === "" ? "" : (p?.freelancerAiDiscount || 0), transform: (v: number) => v, hint: 'Discount on AI features' }
  ],
  candidate: [
    { key: 'candidatePrice', label: 'Price (₹)', prefix: true, suffix: null, getValue: (p: any) => p?.candidatePrice === "" ? "" : (p?.candidatePrice / 100 || 0), transform: (v: number) => Math.round(v * 100), hint: 'Amount charged for subscription' },
    { key: 'candidateDurationMonths', label: 'Duration (Months)', prefix: false, suffix: 'months', getValue: (p: any) => p?.candidateDurationMonths === "" ? "" : (p?.candidateDurationMonths || 0), transform: (v: number) => v, hint: 'Subscription validity period' },
    { key: 'candidateResumeLimit', label: 'Resume Limit', prefix: false, suffix: 'resumes', getValue: (p: any) => p?.candidateResumeLimit === "" ? "" : (p?.candidateResumeLimit || 0), transform: (v: number) => v, hint: 'Maximum resumes allowed' },
    { key: 'candidateAiDiscount', label: 'AI Discount (%)', prefix: false, suffix: '%', getValue: (p: any) => p?.candidateAiDiscount === "" ? "" : (p?.candidateAiDiscount || 0), transform: (v: number) => v, hint: 'Discount on AI features' }
  ]
};

export const PricingConfig: React.FC<PricingConfigProps> = ({ pricing, onSave, onUploadSignature }) => {
  const [localPricing, setLocalPricing] = React.useState(pricing);
  
  React.useEffect(() => {
    setLocalPricing(pricing);
  }, [pricing]);

  const [saving, setSaving] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (key: string, value: any) => {
    setLocalPricing((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onSave(localPricing);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSignatureUpload = async () => {
    if (!signatureFile) return;
    setUploadingSignature(true);
    try {
      const signatureUrl = await onUploadSignature(signatureFile);
      handleFieldChange('adminSignature', signatureUrl);
      setSignatureFile(null);
    } finally {
      setUploadingSignature(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#04477E] to-[#0660a9] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Payment Configuration</h3>
            <p className="text-blue-100">Manage your subscription and pay-per-use pricing</p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur px-4 py-2 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-sm">Saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Freelancer Plan */}
        <PlanCard
          title="Freelancer Plan"
          icon={Star}
          color={{
            gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10',
          
            text: 'text-blue-600 dark:text-blue-400',
            description: 'High volume configuration'
          }}
          planKey="freelancer"
          fields={configFields.freelancer}
          localPricing={localPricing}
          onChange={handleFieldChange}
        />

        {/* Candidate Plan */}
        <PlanCard
          title="Candidate Plan"
          icon={Users}
          color={{
            gradient: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10',
           
            text: 'text-green-600 dark:text-green-400',
            description: 'Regular user configuration'
          }}
          planKey="candidate"
          fields={configFields.candidate}
          localPricing={localPricing}
          onChange={handleFieldChange}
        />

        {/* Auto-Pay Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2rounded-lg">
                <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Renewal Settings</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure automatic payment cycles</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-Pay Cycle Limit</label>
            <input 
              type="number" 
              required 
              value={localPricing?.autoPayCycleLimit === "" ? "" : (localPricing?.autoPayCycleLimit ?? 5)} 
              onChange={e => handleFieldChange('autoPayCycleLimit', e.target.value === "" ? "" : Number(e.target.value))} 
              className="w-full md:w-64 px-4 py-2 border border-blue-200 dark:border-blue-900 rounded-xl bg-blue-50/30 dark:bg-blue-900/10 font-bold" 
            />
            <p className="text-xs text-gray-400 mt-2">Maximum number of automatic renewal cycles before requiring manual confirmation</p>
          </div>
        </div>

        {/* Guest Pricing */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2  rounded-lg">
                <FaMoneyBill className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Guest Rates</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pay-per-use base prices for non-subscribers</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Download Cost (₹)</label>
              <input 
                type="number" 
                required 
                value={localPricing?.guestDownload === "" ? "" : (localPricing?.guestDownload ? localPricing.guestDownload / 100 : 0)} 
                onChange={e => handleFieldChange('guestDownload', e.target.value === "" ? "" : Math.round(Number(e.target.value) * 100))} 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guest AI Cost (₹)</label>
              <input 
                type="number" 
                required 
                value={localPricing?.guestAi === "" ? "" : (localPricing?.guestAi ? localPricing.guestAi / 100 : 0)} 
                onChange={e => handleFieldChange('guestAi', e.target.value === "" ? "" : Math.round(Number(e.target.value) * 100))} 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700" 
              />
            </div>
          </div>
        </div>

        {/* Signature Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2  rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Signature</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Authorized signatory for invoices</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload New Signature</label>
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setSignatureFile(e.target.files?.[0] || null)}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm" 
                  />
                  <button
                    type="button"
                    onClick={handleSignatureUpload}
                    disabled={uploadingSignature || !signatureFile}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap transition-all"
                  >
                    {uploadingSignature ? <RefreshCw className="w-4 h-4 animate-spin" /> : ""}
                    Upload
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">PNG or JPG format, recommended size: 300x100px</p>
              </div>
              
              <div className="w-full md:w-64 flex flex-col items-center p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase">Current Signature</p>
                {localPricing?.adminSignature ? (
                  <img src={localPricing.adminSignature} alt="Signature" className="max-h-20 object-contain shadow-sm" />
                ) : (
                  <div className="h-20 flex items-center justify-center text-gray-400 italic text-xs">No signature set</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-[#04477E] to-[#0660a9] hover:from-[#033b66] hover:to-[#04477E] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Saving Configuration...
              </>
            ) : (
              <>
                {/* <Save className="w-5 h-5" /> */}
                Save All Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};