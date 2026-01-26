/**
 * Setup Wizard - Phase 1: Basics
 * 
 * Collects essential business information:
 * - Business name
 * - Business type (photographer, videographer, etc.)
 * - Timezone
 * - Currency
 * - Logo upload
 * - Primary brand color
 * - Tagline
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, Upload, Building2 } from 'lucide-react';

interface BasicsPhaseProps {
  initialData?: {
    businessName?: string;
    businessType?: string;
    timezone?: string;
    currency?: string;
    tagline?: string;
    primaryColor?: string;
  };
  onComplete: () => void;
}

const BUSINESS_TYPES = [
  { value: 'portrait', label: 'Portrait Photographer' },
  { value: 'wedding', label: 'Wedding Photographer' },
  { value: 'newborn', label: 'Newborn Photographer' },
  { value: 'family', label: 'Family Photographer' },
  { value: 'commercial', label: 'Commercial Photographer' },
  { value: 'event', label: 'Event Photographer' },
  { value: 'videographer', label: 'Videographer' },
  { value: 'studio', label: 'Photo Studio' },
  { value: 'other', label: 'Other' }
];

const TIMEZONES = [
  { value: 'Europe/Vienna', label: 'Vienna (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Zurich', label: 'Zurich (CET)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'America/Chicago', label: 'Chicago (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
];

const CURRENCIES = [
  { value: 'EUR', label: '€ Euro (EUR)' },
  { value: 'USD', label: '$ US Dollar (USD)' },
  { value: 'GBP', label: '£ British Pound (GBP)' },
  { value: 'CHF', label: 'Fr Swiss Franc (CHF)' },
  { value: 'AUD', label: '$ Australian Dollar (AUD)' }
];

export default function BasicsPhase({ initialData, onComplete }: BasicsPhaseProps) {
  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || '',
    businessType: initialData?.businessType || '',
    timezone: initialData?.timezone || 'Europe/Vienna',
    currency: initialData?.currency || 'EUR',
    tagline: initialData?.tagline || '',
    primaryColor: initialData?.primaryColor || '#3B82F6'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/setup/basics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save basics');
      return res.json();
    },
    onSuccess: () => {
      onComplete();
    }
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }
    if (!formData.timezone) {
      newErrors.timezone = 'Please select a timezone';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      saveMutation.mutate(formData);
    }
  };
  
  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Tell us about your business</CardTitle>
            <CardDescription>
              This information will be used throughout your studio management system
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="e.g., New Age Fotografie"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className={errors.businessName ? 'border-red-500' : ''}
          />
          {errors.businessName && (
            <p className="text-sm text-red-500">{errors.businessName}</p>
          )}
        </div>
        
        {/* Business Type */}
        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type *</Label>
          <Select 
            value={formData.businessType} 
            onValueChange={(value) => handleChange('businessType', value)}
          >
            <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && (
            <p className="text-sm text-red-500">{errors.businessType}</p>
          )}
        </div>
        
        {/* Timezone & Currency Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone *</Label>
            <Select 
              value={formData.timezone} 
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => handleChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(curr => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tagline */}
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline (optional)</Label>
          <Textarea
            id="tagline"
            placeholder="e.g., Capturing life's precious moments"
            value={formData.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            rows={2}
          />
          <p className="text-xs text-gray-500">
            A short phrase that describes your business
          </p>
        </div>
        
        {/* Brand Color */}
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Brand Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="primaryColor"
              value={formData.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-12 h-12 rounded-lg border cursor-pointer"
            />
            <Input
              value={formData.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-32 font-mono"
              placeholder="#3B82F6"
            />
            <div 
              className="flex-1 h-12 rounded-lg"
              style={{ backgroundColor: formData.primaryColor }}
            />
          </div>
        </div>
        
        {/* Logo Upload (placeholder for now) */}
        <div className="space-y-2">
          <Label>Logo (optional)</Label>
          <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, or SVG up to 2MB
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6 border-t">
        <p className="text-sm text-gray-500">
          * Required fields
        </p>
        <Button 
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
          className="gap-2"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
}
