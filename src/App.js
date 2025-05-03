import React, { useState, useEffect } from 'react';
import SliderInput from './components/SliderInput';
import RevenueChart from './components/RevenueChart';
import StatsCard from './components/StatsCard';

function App() {
  // Revenue model type
  const [revenueModel, setRevenueModel] = useState('b2b'); // 'b2b', 'b2c', or 'race'

  // Default values for our variables
  const [photographers, setPhotographers] = useState(100);
  const [collectionsPerPhotographer, setCollectionsPerPhotographer] = useState(4);
  
  // B2B model variables (sponsor)
  const [sponsorsPerCollection, setSponsorsPerCollection] = useState(2);
  // Sponsor price is now calculated dynamically based on attendee count
  
  // Race & B2C model variables
  const [peoplePerCollection, setPeoplePerCollection] = useState(200);
  const [basicConversionRate, setBasicConversionRate] = useState(15); // percentage
  const [basicUnlockPrice, setBasicUnlockPrice] = useState(5); // Basic unlock price
  const [premiumConversionRate, setPremiumConversionRate] = useState(5); // percentage
  const [premiumPackPrice, setPremiumPackPrice] = useState(10); // Premium pack price
  
  // Photographer gets 60% of all sales in Race & B2C models
  const photographerRevShare = 60;
  
  // Growth rate
  const [growthRate, setGrowthRate] = useState(20); // percentage monthly growth

  // Calculated values
  const [monthlyStats, setMonthlyStats] = useState({
    totalEvents: 0,
    sponsorRevenue: 0,
    basicAttendeeRevenue: 0,
    premiumAttendeeRevenue: 0,

    totalAttendeeRevenue: 0,
    totalGrossRevenue: 0,
    photographerPayouts: 0,
    totalNetRevenue: 0,
  });

  // 12-month projections
  const [projections, setProjections] = useState([]);

  // Calculate monthly stats and projections when any variable changes
  useEffect(() => {
    // Calculate monthly stats
    const totalCollections = photographers * collectionsPerPhotographer;
    
    // Calculate sponsor price based on attendee count
    let calculatedSponsorPrice = 50; // Default
    if (attendeesPerEvent > 500) {
      calculatedSponsorPrice = 200;
    } else if (attendeesPerEvent > 300) {
      calculatedSponsorPrice = 150;
    } else if (attendeesPerEvent > 150) {
      calculatedSponsorPrice = 100;
    }
    
    const sponsorRevenue = totalCollections * sponsorsPerCollection * calculatedSponsorPrice;
    
    // Calculate attendee/people revenues
    const totalPeople = totalCollections * peoplePerCollection;
    const basicUnlocks = totalPeople * (basicConversionRate / 100);
    const premiumPacks = totalPeople * (premiumConversionRate / 100);
    
    const basicAttendeeRevenue = basicUnlocks * basicUnlockPrice;
    const premiumAttendeeRevenue = premiumPacks * premiumPackPrice;
    const totalAttendeeRevenue = basicAttendeeRevenue + premiumAttendeeRevenue;
    
    // Calculate total revenue based on model
    let totalGrossRevenue;
    if (revenueModel === 'b2b') {
      totalGrossRevenue = sponsorRevenue;
    } else if (revenueModel === 'b2c' || revenueModel === 'race') {
      totalGrossRevenue = totalAttendeeRevenue;
    }
    
    // Calculate photographer payouts (60% for B2C/Race models, 0% for B2B)
    const photographerPayouts = (revenueModel === 'b2c' || revenueModel === 'race') ? 
      totalGrossRevenue * (photographerRevShare / 100) : 0;
    
    // Calculate net revenue (after photographer payouts)
    const totalNetRevenue = totalGrossRevenue - photographerPayouts;

    setMonthlyStats({
      totalCollections,
      sponsorRevenue,
      basicAttendeeRevenue,
      premiumAttendeeRevenue,

      totalAttendeeRevenue,
      totalGrossRevenue,
      photographerPayouts,
      totalNetRevenue,
    });

    // Calculate 12-month projections with growth factor
    const projections = [];
    let currentRevenue = totalNetRevenue;

    for (let i = 0; i < 12; i++) {
      projections.push(Math.round(currentRevenue));
      currentRevenue *= (1 + growthRate / 100);
    }

    setProjections(projections);
  }, [
    revenueModel,
    photographers, 
    collectionsPerPhotographer, 
    sponsorsPerCollection, 
    sponsorPrice, 
    peoplePerCollection,
    basicConversionRate,
    basicUnlockPrice,
    premiumConversionRate,
    premiumPackPrice,

    growthRate
  ]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">primeshot Revenue Projections</h1>
          <p className="mt-2 text-lg text-gray-600">Scale to $500K+ by December 2025</p>
        </div>

        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Sliders */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Model</h2>
              <div className="flex space-x-4 mb-6">
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${revenueModel === 'b2b' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setRevenueModel('b2b')}
                >
                  B2B
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${revenueModel === 'b2c' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setRevenueModel('b2c')}
                >
                  B2C
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${revenueModel === 'race' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setRevenueModel('race')}
                >
                  Race
                </button>
              </div>
              
              <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Growth</h2>
              <SliderInput
                label="Photographers"
                value={photographers}
                min={10}
                max={500}
                step={10}
                onChange={setPhotographers}
              />
              <SliderInput
                label="Collections Per Photographer (monthly)"
                value={collectionsPerPhotographer}
                min={1}
                max={10}
                step={1}
                onChange={setCollectionsPerPhotographer}
              />
              <SliderInput
                label={revenueModel === 'b2c' ? "People Per Collection" : revenueModel === 'race' ? "Attendees Per Collection" : "Attendees Per Collection"}
                value={peoplePerCollection}
                min={revenueModel === 'b2c' ? 1 : 50}
                max={revenueModel === 'b2c' ? 100 : 1000}
                step={revenueModel === 'b2c' ? 1 : 50}
                onChange={setPeoplePerCollection}
              />
              <SliderInput
                label="Monthly Growth Rate"
                value={growthRate}
                min={5}
                max={50}
                step={5}
                onChange={setGrowthRate}
                unit="%"
              />
              
              {revenueModel === 'b2b' && (
                <>
                  <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">B2B Model</h2>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-700 font-medium mb-2">Tiered Sponsor Pricing</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>Up to 150 attendees: $50 per sponsor</li>
                      <li>151-300 attendees: $100 per sponsor</li>
                      <li>301-500 attendees: $150 per sponsor</li>
                      <li>500+ attendees: $200 per sponsor</li>
                    </ul>
                  </div>
                  <SliderInput
                    label="Sponsors Per Collection"
                    value={sponsorsPerCollection}
                    min={0}
                    max={10}
                    step={1}
                    onChange={setSponsorsPerCollection}
                  />
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Current Sponsor Price</span>
                      <span className="text-sm font-bold text-gray-900">
                        {peoplePerCollection <= 150 ? '$50' : 
                         peoplePerCollection <= 300 ? '$100' : 
                         peoplePerCollection <= 500 ? '$150' : '$200'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Sponsor Value Proposition:</p>
                    <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                      <li>Full resolution event photos in one place</li>
                      <li>Social footprint analytics of the event</li>
                      <li>Attendee insights and UGC creator identification</li>
                      <li>AI-powered content recommendations</li>
                    </ul>
                  </div>
                </>
              )}
              
              {(revenueModel === 'b2c' || revenueModel === 'race') && (
                <>
                  <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">
                    {revenueModel === 'b2c' ? 'B2C Model' : 'Race Model'}
                  </h2>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-xs text-blue-700 mb-2">Photographer rev share fixed at 60%</p>
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Basic Photo Access</h3>
                  <SliderInput
                    label="Basic Conversion Rate"
                    value={basicConversionRate}
                    min={1}
                    max={50}
                    step={1}
                    onChange={setBasicConversionRate}
                    unit="%"
                  />
                  <SliderInput
                    label="Basic Unlock Price"
                    value={basicUnlockPrice}
                    min={1}
                    max={20}
                    step={1}
                    onChange={setBasicUnlockPrice}
                    unit="$"
                  />
                  
                  <h3 className="text-sm font-medium text-gray-700 mt-4 mb-2">Premium Photo Pack</h3>
                  <SliderInput
                    label="Premium Conversion Rate"
                    value={premiumConversionRate}
                    min={1}
                    max={30}
                    step={1}
                    onChange={setPremiumConversionRate}
                    unit="%"
                  />
                  <SliderInput
                    label="Premium Pack Price"
                    value={premiumPackPrice}
                    min={5}
                    max={30}
                    step={5}
                    onChange={setPremiumPackPrice}
                    unit="$"
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Right Column - Chart and Stats */}
          <div className="lg:col-span-2">
            {/* Chart */}
            <div className="mb-6">
              <RevenueChart projections={projections} />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <StatsCard
                title="Primeshot Collections"
                value={monthlyStats.totalCollections.toLocaleString()}
                subtitle="Total collections per month"
                color="blue"
              />
              <StatsCard
                title="Monthly Net Revenue"
                value={formatCurrency(monthlyStats.totalNetRevenue)}
                subtitle="After photographer payouts"
                color="green"
              />
              
              {revenueModel === 'b2b' && (
                <StatsCard
                  title="B2B Revenue"
                  value={formatCurrency(monthlyStats.sponsorRevenue)}
                  subtitle={`${sponsorsPerCollection} sponsors × ${peoplePerCollection <= 150 ? '$50' : 
                    peoplePerCollection <= 300 ? '$100' : 
                    peoplePerCollection <= 500 ? '$150' : '$200'} per collection`}
                  color="purple"
                />
              )}
              
              {(revenueModel === 'b2c' || revenueModel === 'race') && (
                <StatsCard
                  title={revenueModel === 'b2c' ? "B2C Revenue" : "Race Revenue"}
                  value={formatCurrency(monthlyStats.totalAttendeeRevenue)}
                  subtitle="All attendee purchases"
                  color="orange"
                />
              )}
            </div>

            {/* Projected Annual Revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Projected Annual Revenue</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">First Month</span>
                <span className="font-bold text-gray-900">{formatCurrency(monthlyStats.totalNetRevenue)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">After 12 Months</span>
                <span className="font-bold text-gray-900">{formatCurrency(projections[11] || 0)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">12-Month Total</span>
                <span className="font-bold text-gray-900">{formatCurrency(projections.reduce((sum, val) => sum + val, 0))}</span>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            {(revenueModel === 'b2c' || revenueModel === 'race') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {revenueModel === 'b2c' ? 'B2C Revenue Breakdown' : 'Race Revenue Breakdown'}
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Basic Photo Access</span>
                    <span className="font-medium text-gray-900">{formatCurrency(monthlyStats.basicAttendeeRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Premium Photo Packs</span>
                    <span className="font-medium text-gray-900">{formatCurrency(monthlyStats.premiumAttendeeRevenue)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-800 font-medium">Total Revenue</span>
                    <span className="font-bold text-gray-900">{formatCurrency(monthlyStats.totalAttendeeRevenue)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Photographer Payouts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Distribution</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Revenue</span>
                <span className="font-medium text-gray-900">{formatCurrency(monthlyStats.totalGrossRevenue)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Photographer Payouts {(revenueModel === 'b2c' || revenueModel === 'race') ? '(60%)' : '(0%)'}</span>
                <span className="font-medium text-gray-900">{formatCurrency(monthlyStats.photographerPayouts)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100">
                <span className="text-gray-800 font-medium">Net Revenue (primeshot)</span>
                <span className="font-bold text-gray-900">{formatCurrency(monthlyStats.totalNetRevenue)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>primeshot Revenue Projection Tool © 2025</p>
        </div>
      </div>
    </div>
  );
}

export default App;
