
import React, { useState, useEffect } from 'react';
import { UserProfile, DivinationType } from '../types';
import { X, Feather, Scroll, Clock, Moon, Star, Compass } from 'lucide-react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: UserProfile) => void;
}

const ZODIACS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", 
  "狮子座", "处女座", "天秤座", "天蝎座", 
  "射手座", "摩羯座", "水瓶座", "双鱼座"
];

// Helper to calculate Zodiac based on Date
const getZodiac = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "白羊座";

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Cutoff dates for start of the NEXT sign
  const cutoffs = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
  
  const mIndex = month - 1;
  const cutoffDay = cutoffs[mIndex];
  
  if (day < cutoffDay) {
    const prevSigns = [
      "摩羯座", "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", 
      "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座"
    ];
    return prevSigns[mIndex];
  } else {
    const nextSigns = [
      "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", 
      "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座"
    ];
    return nextSigns[mIndex];
  }
};

const calculateAge = (dateStr: string): string => {
  const birthDate = new Date(dateStr);
  if (isNaN(birthDate.getTime())) return "";
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
};

export const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [method, setMethod] = useState<DivinationType>('daily');
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    gender: '男',
    age: '',
    zodiac: '白羊座',
    intent: '',
    dreamContent: '',
    birthHour: 'unknown',
    type: 'daily'
  });

  const [birthDate, setBirthDate] = useState('');

  // Auto-calculate Age and Zodiac when birth date changes
  useEffect(() => {
    if (birthDate) {
      const newAge = calculateAge(birthDate);
      const newZodiac = getZodiac(birthDate);
      setFormData(prev => ({
        ...prev,
        age: newAge,
        zodiac: newZodiac
      }));
    }
  }, [birthDate]);

  // Sync method state with formData
  useEffect(() => {
    setFormData(prev => ({ ...prev, type: method }));
  }, [method]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-[#e7e5e4] rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border-2 border-[#5c4033]">
        
        {/* Paper Texture */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] pointer-events-none"></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-500 hover:text-red-700 transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* --- METHOD SELECTION TABS --- */}
        <div className="flex w-full border-b border-[#5c4033]/20 relative z-10 bg-[#d6d3d1]/50">
            <button 
                onClick={() => setMethod('daily')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors relative ${method === 'daily' ? 'text-amber-900 bg-[#e7e5e4]' : 'text-stone-500 hover:bg-[#e7e5e4]/50'}`}
            >
                <Compass size={16} />
                <span className="text-[10px] tracking-widest font-bold">每日灵签</span>
                {method === 'daily' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-800"></div>}
            </button>
            <button 
                onClick={() => setMethod('ziwei')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors relative ${method === 'ziwei' ? 'text-purple-900 bg-[#e7e5e4]' : 'text-stone-500 hover:bg-[#e7e5e4]/50'}`}
            >
                <Star size={16} />
                <span className="text-[10px] tracking-widest font-bold">紫微斗数</span>
                {method === 'ziwei' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-800"></div>}
            </button>
            <button 
                onClick={() => setMethod('dream')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors relative ${method === 'dream' ? 'text-indigo-900 bg-[#e7e5e4]' : 'text-stone-500 hover:bg-[#e7e5e4]/50'}`}
            >
                <Moon size={16} />
                <span className="text-[10px] tracking-widest font-bold">周公解梦</span>
                {method === 'dream' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-800"></div>}
            </button>
        </div>

        {/* Header */}
        <div className="pt-6 pb-2 text-center relative z-10">
          <div className="inline-flex flex-col items-center">
             <div className="flex items-center gap-2 text-stone-800 mb-1">
                <Scroll size={16} />
                <span className="text-xs font-serif tracking-[0.4em] font-bold">
                    {method === 'daily' && '综合运势庚帖'}
                    {method === 'ziwei' && '紫微排盘信息'}
                    {method === 'dream' && '梦境解析详请'}
                </span>
             </div>
             <div className="h-[1px] w-24 bg-stone-400/50"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 relative z-10 font-serif space-y-4">
          
          {/* Row 1: Name & Gender */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-stone-500 uppercase tracking-widest">姓名 (Name)</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-transparent border-b border-stone-400 focus:border-amber-700 outline-none py-1 text-stone-800 placeholder-stone-400/50 text-sm transition-colors"
                placeholder="善信"
              />
            </div>
            <div className="w-1/3 space-y-1">
              <label className="text-[10px] text-stone-500 uppercase tracking-widest">性别</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-transparent border-b border-stone-400 focus:border-amber-700 outline-none py-1 text-stone-800 text-sm"
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>

          {/* Row 2: Birth Date & Zodiac (Always needed for Ziwei/Daily, nice to have for Dream) */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="flex justify-between items-end text-[10px] text-stone-500 uppercase tracking-widest">
                <span>出生日期 (Date)</span>
                {formData.age && <span className="text-amber-800 font-bold ml-2">({formData.age}岁)</span>}
              </label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-transparent border-b border-stone-400 focus:border-amber-700 outline-none py-1 text-stone-800 text-sm uppercase"
                required={method !== 'dream'} // Not strictly required for Dream
              />
            </div>
            <div className="w-1/3 space-y-1">
              <label className="text-[10px] text-stone-500 uppercase tracking-widest">星座</label>
              <select 
                value={formData.zodiac}
                onChange={(e) => setFormData({...formData, zodiac: e.target.value})}
                className="w-full bg-transparent border-b border-stone-400 focus:border-amber-700 outline-none py-1 text-stone-800 text-sm transition-colors"
              >
                {ZODIACS.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Birth Hour (Crucial for Ziwei) */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-widest">
              <Clock size={10} /> 出生时辰 (Birth Hour)
              {method === 'ziwei' && <span className="text-red-500 text-[9px] ml-1">*紫微必填</span>}
            </label>
            <select
                value={formData.birthHour}
                onChange={(e) => setFormData({...formData, birthHour: e.target.value})}
                className="w-full bg-transparent border-b border-stone-400 focus:border-amber-700 outline-none py-1 text-stone-800 text-sm"
            >
                <option value="unknown">不清楚时辰 (Unknown)</option>
                <option value="23-1">子时 (23:00 - 01:00)</option>
                <option value="1-3">丑时 (01:00 - 03:00)</option>
                <option value="3-5">寅时 (03:00 - 05:00)</option>
                <option value="5-7">卯时 (05:00 - 07:00)</option>
                <option value="7-9">辰时 (07:00 - 09:00)</option>
                <option value="9-11">巳时 (09:00 - 11:00)</option>
                <option value="11-13">午时 (11:00 - 13:00)</option>
                <option value="13-15">未时 (13:00 - 15:00)</option>
                <option value="15-17">申时 (15:00 - 17:00)</option>
                <option value="17-19">酉时 (17:00 - 19:00)</option>
                <option value="19-21">戌时 (19:00 - 21:00)</option>
                <option value="21-23">亥时 (21:00 - 23:00)</option>
            </select>
          </div>

          {/* Row 4: Intent OR Dream Content */}
          <div className="space-y-1 pt-2">
            <label className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-widest">
              {method === 'dream' ? <Moon size={10} /> : <Feather size={10} />}
              {method === 'dream' ? '梦境描述 (Dream Description)' : '所求之事 (Intent)'}
            </label>
            
            {method === 'dream' ? (
                <textarea 
                value={formData.dreamContent}
                onChange={(e) => setFormData({...formData, dreamContent: e.target.value})}
                className="w-full bg-[#f5f5f4] border border-stone-300 focus:border-indigo-700 outline-none p-3 rounded-sm text-stone-800 text-sm h-20 align-top resize-none shadow-inner"
                placeholder="请详述梦中情境、事物、颜色与感受..."
                required
              />
            ) : (
                <textarea 
                value={formData.intent}
                onChange={(e) => setFormData({...formData, intent: e.target.value})}
                className={`w-full bg-[#f5f5f4] border border-stone-300 outline-none p-3 rounded-sm text-stone-800 text-sm h-16 align-top resize-none shadow-inner ${method === 'ziwei' ? 'focus:border-purple-700' : 'focus:border-amber-700'}`}
                placeholder={method === 'ziwei' ? "如：流年运势、事业发展、大限吉凶..." : "如：事业、财运、姻缘、或心中困惑..."}
              />
            )}
            
          </div>

          {/* Submit Button */}
          <div className="pt-2 text-center">
            <button 
              type="submit"
              className={`px-8 py-2 text-[#e7e5e4] text-sm tracking-[0.3em] font-bold rounded-sm shadow-lg transition-colors transform active:scale-95 duration-200
                ${method === 'daily' ? 'bg-[#292524] hover:bg-amber-900' : ''}
                ${method === 'ziwei' ? 'bg-purple-900 hover:bg-purple-800' : ''}
                ${method === 'dream' ? 'bg-indigo-900 hover:bg-indigo-800' : ''}
              `}
            >
              {method === 'daily' && '呈递天听'}
              {method === 'ziwei' && '排盘推演'}
              {method === 'dream' && '解梦释疑'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
