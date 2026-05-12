import React, { useEffect, useState } from "react";
import { pricingAPI } from "../../services/apiClient";

interface ActivityFeedProps {
  resumeId?: string;
}

export default function PricingDetailsPopup({ resumeId }: ActivityFeedProps) {
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pricingAPI.get()
      .then(res => {
        setPricing(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load pricing:", err);
        setLoading(false);
      });
  }, []);

  const isUser = !!localStorage.getItem("token");
  
  const getUserSubscription = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.subscriptionPlan || null;
    } catch (e) {
      return null;
    }
  };

  const userSubscription = getUserSubscription();
  
  const getPriceInfo = (type: "download" | "ai") => {
    if (!pricing) return { original: null, discounted: null, discount: 0 };
    
    if (type === "download") {
      const originalPrice = pricing.guestDownload / 100;
      return { original: originalPrice, discounted: originalPrice, discount: 0 };
    } else {
      const originalPrice = pricing.guestAi / 100;
      let discount = 0;
      
      if (isUser) {
        if (userSubscription === "freelancer") {
          discount = pricing.freelancerAiDiscount || 0;
        } else if (userSubscription === "candidate") {
          discount = pricing.candidateAiDiscount || 0;
        }
      }
      
      const discountedPrice = originalPrice * (1 - discount / 100);
      return { original: originalPrice, discounted: discountedPrice, discount };
    }
  };

  const downloadPrice = getPriceInfo("download");
  const aiPrice = getPriceInfo("ai");

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Premium Features</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Enhance your resume with professional tools and export options.
        </p>
      </div>

      {/* AI Enhancement Section */}
      <div className="mb-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-[#01467d] mb-1">Deep AI Enhancement</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Upgrade your resume sentences with data-driven, ATS-tested improvements.
          </p>
        </div>
        
        <div className="mb-3">
          {aiPrice.discount > 0 ? (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Price:</span>{' '}
              <span className="text-[#01467d] font-semibold">₹{aiPrice.discounted?.toFixed(2)}</span>{' '}
              <span className="text-gray-400 line-through">₹{aiPrice.original?.toFixed(2)}</span>{' '}
              <span className="text-green-600 text-xs">({aiPrice.discount}% off for subscribers)</span>
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Price:</span>{' '}
              <span className="text-[#01467d] font-semibold">₹{aiPrice.original?.toFixed(2)}</span>
              {isUser && (
                <span className="text-[#dea42c] text-xs ml-2">(Subscribe for discount)</span>
              )}
            </p>
          )}
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800 mb-2">Features:</p>
          <ul className="space-y-1">
            {[
              "Professional high-impact suggestions",
              "Grammar, tone and phrasing improvements",
              "Keyword injection for ATS bypass",
              "Deep clarity and flow adjustments",
              "Data-driven measurable impact metrics",
              "1 free download Docx/Pdf credit"
            ].map((item, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-[#dea42c] mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Note:</span> AI Enhancement uses advanced algorithms to optimize your resume content.
          </p>
        </div>
      </div>

      {/* Download Section */}
      <div className="mb-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-[#01467d] mb-1">Premium Export</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Get your professionally crafted resume in industry-standard formats.
          </p>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Price:</span>{' '}
            <span className="text-[#01467d] font-semibold">₹{downloadPrice.original?.toFixed(2)}</span>
            <span className="text-gray-500 text-xs ml-2">(one-time payment)</span>
          </p>
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800 mb-2">Formats included:</p>
          <ul className="space-y-1">
            {[
              "PDF format with perfect ATS layout",
              "Word document for easy fine-tuning",
              "High-quality print ready format",
              "Instant download after secure checkout"
            ].map((item, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-[#dea42c] mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Note:</span> All exports maintain perfect formatting and ATS compatibility.
          </p>
        </div>
      </div>

      {/* Subscription Benefits */}
      {!isUser && (
        <div className="mb-8 p-4 bg-gray-50 border-l-4 border-[#dea42c] rounded-r">
          <p className="text-sm font-medium text-gray-900 mb-1">Special Offer for Subscribers</p>
          <p className="text-sm text-gray-600">
            Subscribe to our plan and get up to {pricing?.candidateAiDiscount || 20}% discount on AI Enhancement!
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <p>• {pricing?.candidateAiDiscount || 20}% discount for Candidate plan</p>
            <p>• {pricing?.freelancerAiDiscount || 30}% discount for Freelancer plan</p>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">How does AI Enhancement work?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our AI analyzes your resume content and provides intelligent suggestions to improve impact, 
              clarity, and ATS compatibility using advanced language models.
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">What formats are available for export?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              You'll receive PDF (ATS-optimized), Word (.docx), and high-quality print-ready formats with every purchase.
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Is my payment secure?</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, we use 256-bit SSL encryption and secure payment gateways for all transactions.
            </p>
          </div>
          
         
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Prices are for reference only. Actual features may vary based on subscription status.
        </p>
      </div>

    </div>
  );
}