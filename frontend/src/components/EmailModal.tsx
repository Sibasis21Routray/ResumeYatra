import React, { useState } from 'react';
import { X, Mail, Send, Loader } from 'lucide-react';
import { resumeAPI } from '../services/apiClient';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  resumeTitle: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  resumeId,
  resumeTitle,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState(`Resume: ${resumeTitle}`);
  const [body, setBody] = useState(`Dear ,

Please find attached my resume for your consideration.

Best regards,
ResumeYatra`);
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!recipientEmail.trim() || !subject.trim() || !body.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      await resumeAPI.sendEmail(resumeId, {
        to: recipientEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
        format,
      });

      // Reset form and close modal
      setRecipientEmail('');
      setSubject(`Resume: ${resumeTitle}`);
      setBody(`Dear ,

Please find attached my resume for your consideration.

Best regards,
[Your Name]`);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#04477E] to-[#0660a9] flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#04477E] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#04477E] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#04477E] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Resume Format
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat('pdf')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  format === 'pdf'
                    ? 'bg-[#04477E] text-white border-[#04477E]'
                    : 'border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setFormat('docx')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  format === 'docx'
                    ? 'bg-[#04477E] text-white border-[#04477E]'
                    : 'border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                DOCX
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#04477E] to-[#0660a9] text-white rounded-lg hover:shadow-lg hover:shadow-[#04477E]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};