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
import { Loader2, ArrowRight, Upload, Building2, MapPin, Phone, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { DATE_FORMAT_OPTIONS, DateFormatPreset, getDateFormatPreset, setDateFormatPreset } from '@/lib/dateFormat';

interface BasicsPhaseProps {
  initialData?: {
    businessName?: string;
    businessType?: string;
    timezone?: string;
    currency?: string;
    dateFormat?: string;
    tagline?: string;
    primaryColor?: string;
    address?: string;
    phone?: string;
    website?: string;
    latitude?: string;
    longitude?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
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
    dateFormat: (initialData?.dateFormat as DateFormatPreset) || getDateFormatPreset(),
    tagline: initialData?.tagline || '',
    primaryColor: initialData?.primaryColor || '#3B82F6',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    facebookUrl: initialData?.facebookUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
  });

  const [showLocation, setShowLocation] = useState(!!(initialData?.latitude || initialData?.address));
  const [showSocial, setShowSocial] = useState(!!(initialData?.facebookUrl || initialData?.instagramUrl));
  
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
      // Persist date format preference to localStorage so it takes effect immediately
      setDateFormatPreset(formData.dateFormat as DateFormatPreset);
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

        {/* Date Format */}
        <div className="space-y-2">
          <Label htmlFor="dateFormat">Date Format</Label>
          <Select
            value={formData.dateFormat}
            onValueChange={(value) => handleChange('dateFormat', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FORMAT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Choose "Auto-detect" to use your browser/PC regional settings, or pick a specific format.
          </p>
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

        {/* Phone & Website Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="w-3.5 h-3.5 inline mr-1" />
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+43 1 234 5678"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">
              <Globe className="w-3.5 h-3.5 inline mr-1" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://www.yourstudio.com"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>
        </div>

        {/* Location Section (collapsible) */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setShowLocation(!showLocation)}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Address & Location
            </span>
            {showLocation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showLocation && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main Street&#10;Vienna, 1010&#10;Austria"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Used on invoices, emails, and your public website.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="48.2082"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="16.3738"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Used for map embeds on your public site. Find yours at{' '}
                <a href="https://www.latlong.net/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                  latlong.net
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Social Media Section (collapsible) */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setShowSocial(!showSocial)}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Social Media Links
            </span>
            {showSocial ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showSocial && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram</Label>
                <Input
                  id="instagramUrl"
                  placeholder="https://instagram.com/yourstudio"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook</Label>
                <Input
                  id="facebookUrl"
                  placeholder="https://facebook.com/yourstudio"
                  value={formData.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">X (Twitter)</Label>
                <Input
                  id="twitterUrl"
                  placeholder="https://x.com/yourstudio"
                  value={formData.twitterUrl}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                />
              </div>
            </div>
          )}
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
