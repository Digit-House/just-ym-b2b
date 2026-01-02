type Props = {
    balance: number;
    selectedAmount: number;
  };
  
  export const BalancePreview = ({ balance, selectedAmount }: Props) => {
    return (
      <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-2xl" />
  
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-white/70 text-sm font-bold mb-1">
              Current Balance
            </p>
            <h3 className="text-4xl font-black">
              THB {balance.toLocaleString()}
            </h3>
          </div>
  
          <div className="border-t border-white/20 pt-6 space-y-2">
            <div className="flex justify-between text-white/80">
              <span className="text-xs font-bold uppercase tracking-widest">
                Top up amount
              </span>
              <span className="text-lg font-black">
                +THB {selectedAmount.toLocaleString()}
              </span>
            </div>
  
            <div className="flex justify-between text-white">
              <span className="text-sm font-black uppercase tracking-widest">
                New balance
              </span>
              <span className="text-3xl font-black">
                THB {(balance + selectedAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  