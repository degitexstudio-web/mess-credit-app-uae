import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { UtensilsCrossed, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export default function MenuView() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMess();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('');
  const [category, setCategory] = useState('Meal');
  const [icon, setIcon] = useState('🍲');

  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const iconsList = ['🥣', '🍲', '🍱', '☕', '🥗', '🫓', '🥛', '🍰'];

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!name.trim() || !defaultPrice || parseFloat(defaultPrice) <= 0) {
      alert('Please enter a valid item name and default price.');
      return;
    }

    addMenuItem({
      name,
      defaultPrice: parseFloat(defaultPrice),
      category,
      icon,
    });

    setShowAddModal(false);
    setName('');
    setDefaultPrice('');
  };

  const handleSavePriceEdit = (id) => {
    if (!editPrice || parseFloat(editPrice) <= 0) return;
    updateMenuItem(id, { defaultPrice: parseFloat(editPrice) });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Meal & Category Rates (AED)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Default rates for Breakfast, Lunch, Dinner & Others (Amounts can be manually edited during daily entry)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95 touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          Add Meal Category
        </button>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => {
          const isEditing = editingItem && editingItem.id === item.id;
          const currentPrice = item.defaultPrice || item.price || 0;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 hover:border-slate-300 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteMenuItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all touch-manipulation"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price Row / Price Edit */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-inner">
                <span className="text-slate-600 font-bold">Default Amount:</span>

                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-20 bg-white border border-amber-500 text-amber-700 font-mono font-bold text-sm rounded-lg px-2 py-1 outline-none shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleSavePriceEdit(item.id)}
                      className="bg-emerald-600 text-white font-bold p-1 rounded-lg shadow-xs touch-manipulation"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="text-slate-500 hover:text-slate-900 p-1 touch-manipulation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-700 text-base">AED {currentPrice}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setEditPrice(String(currentPrice));
                      }}
                      className="text-slate-400 hover:text-amber-600 p-1 touch-manipulation"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD MEAL CATEGORY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-5 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                Add Meal Option
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconsList.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all touch-manipulation ${
                        icon === ic
                          ? 'bg-amber-100 border-amber-500 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Option Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Snacks / Fruit"
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Price (AED) *</label>
                <input
                  type="number"
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(e.target.value)}
                  placeholder="e.g. 15"
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-amber-700 font-mono text-base font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 touch-manipulation"
                >
                  Add Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
