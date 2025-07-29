import React from 'react';

const AnalyticsComingSoon = () => {
    return (
        <div className="min-h-screen bg-[#F9EFED] flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-[#FE9C00] to-[#1B2BD3] rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-[#000038] mb-6">
                    Analytics Aziendali
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-[#737373] mb-8">
                    Stiamo preparando una suite completa di analytics per la tua azienda.
                </p>

                {/* Coming Soon Badge */}
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FE9C00] to-[#1B2BD3] text-white font-semibold rounded-full mb-8">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Prossimamente
                </div>

                {/* Features List */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-[#FE9C00]/20">
                    <h3 className="text-lg font-semibold text-[#000038] mb-6">
                        Cosa potrai fare:
                    </h3>
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#FE9C00] rounded-full"></div>
                            <span className="text-[#737373]">Creare dashboard personalizzate</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#1B2BD3] rounded-full"></div>
                            <span className="text-[#737373]">Monitorare le performance in tempo reale</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#FE9C00] rounded-full"></div>
                            <span className="text-[#737373]">Generare report automatici</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#1B2BD3] rounded-full"></div>
                            <span className="text-[#737373]">Analizzare i dati aziendali</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-sm text-[#737373] mt-8">
                    Nel frattempo, esplora le altre funzionalità di <span className="text-[#FE9C00] font-semibold">DATASHAKER</span>
                </p>
            </div>
        </div>
    );
};

export default AnalyticsComingSoon;