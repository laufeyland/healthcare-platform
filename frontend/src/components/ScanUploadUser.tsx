import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api/api';

const ScanUploaduser = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'uploading'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState('');
  const [inputMethod, setInputMethod] = useState<'upload' | 'history'>('upload'); // New state for input method
  const [loadingHistory, setLoadingHistory] = useState(true); // New state for loading
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loader

  interface AIModel {
    id: number;
    model_name: string;
    created_at: string;
    status: string;
    parameters: Record<string, unknown>;
  }

  interface MedicalHistoryRecord {
    id: number;
    scan: string;
    ai_interpretation: string | { diagnosis: string; confidence: number };
    record_date: string;
  }

  useEffect(() => {
    const fetchAIModels = async () => {
      try {
        const response = await api.get('users/ai/');
        setAIModels(response.data);
      } catch (error) {
        console.error('Error fetching AI models:', error);
      }
    };
    fetchAIModels();

    const fetchMedicalHistory = async () => {
      try {
        setLoadingHistory(true); // Start loading
        const response = await api.get('users/history/');
        setMedicalHistory(response.data);
      } catch (error) {
        console.error('Error fetching medical history:', error);
      } finally {
        setLoadingHistory(false); // Stop loading
      }
    };
    fetchMedicalHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadStatus('idle');
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const SendScan = async () => {
    if (!selectedModel) {
      alert('Please select an AI model before submitting.');
      return;
    }

    if (inputMethod === 'upload' && !selectedFile) {
      alert('Please upload a file before submitting.');
      return;
    }

    if (inputMethod === 'history' && !selectedHistoryId) {
      alert('Please select a medical history record before submitting.');
      return;
    }

    setIsSubmitting(true); // Show submission loader
    setUploadStatus('uploading');
    const formData = new FormData();
    if (inputMethod === 'upload') {
      formData.append('scan', selectedFile as Blob);
    } else {
      formData.append('history_id', selectedHistoryId);
    }
    formData.append('model_id', selectedModel);

    try {
      const endpoint = inputMethod === 'history' ? 'users/history/infer/' : 'users/ai/infer/';
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Scan processed successfully:', response.data);
      setUploadStatus('success');
      alert('Scan processed successfully.');
    } catch (error: any) {
      console.error('Error processing scan:', error?.response?.data?.error);
      setUploadStatus('error');
      alert(`Failed to process the scan: ${error?.response?.data?.error}`);
    } finally {
      setIsSubmitting(false); // Hide submission loader
    }
  };

  return (
    <section id="scan-upload" className="py-16 bg-slate-100 border rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI Scanner
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose to upload a new scan or select an existing medical history record for AI analysis.
          </p>
        </div>

        {/* Input Method Selection */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 border rounded-l-lg ${inputMethod === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setInputMethod('upload')}
          >
            Upload New Scan
          </button>
          <button
            className={`px-4 py-2 border rounded-r-lg ${inputMethod === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setInputMethod('history')}
          >
            Select from History
          </button>
        </div>

        {inputMethod === 'upload' && (
          <div className="max-w-3xl mx-auto">
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <div className="space-y-1 text-center">
                {!selectedFile ? (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1.5} />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                ) : (
                  <div className="py-4">
                    <p className="text-sm font-medium text-gray-900">File ready to upload</p>
                    <div className="mt-4 flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">{selectedFile.name}</span>
                    </div>
                    {previewUrl && (
                      <div className="mt-4 max-w-xs mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="rounded-lg shadow-md max-h-48 object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {inputMethod === 'history' && (
          <div className="max-w-3xl mx-auto">
            <label htmlFor="history-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Medical History Record
            </label>
            {loadingHistory ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                <span className="ml-2 text-sm text-gray-600">Loading medical history...</span>
              </div>
            ) : (
              <select
                id="history-select"
                name="history-select"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedHistoryId}
                onChange={(e) => setSelectedHistoryId(e.target.value)}
              >
                <option value="" disabled>
                  Select a record
                </option>
                {medicalHistory.map((record) => (
                  <option key={record.id} value={record.id}>
                    {`Record ID: ${record.id} - Date: ${new Date(record.record_date).toLocaleDateString()}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* AI Model Selection */}
        <div className="max-w-3xl mx-auto mt-6">
          <label htmlFor="ai-model" className="block text-sm font-medium text-gray-700 mb-2">
            Select AI Model
          </label>
          <select
            id="ai-model"
            name="ai-model"
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="" disabled>
              Select a model
            </option>
            {aiModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.model_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <button
            type="button"
            onClick={SendScan}
            disabled={isSubmitting}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for AI Analysis'
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScanUploaduser;