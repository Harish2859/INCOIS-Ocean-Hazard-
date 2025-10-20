import React, { useState, useMemo } from 'react';
import { mockPosts, mockUsers, mockSafeShelters, mockMedicalCamps, mockRiskAreas, indianStates } from '../constants';
import InteractiveMap from '../components/InteractiveMap';
import StateInsetMap from '../components/StateInsetMap';
import { UserCircleIcon, HomeModernIcon, PlusCircleIcon, ExclamationTriangleIcon, MapIcon, ChartPieIcon, CloudIcon, FireIcon, MapPinIcon, AdjustmentsHorizontalIcon, XMarkIcon, CheckBadgeIcon, QueueListIcon, BeakerIcon } from '@heroicons/react/24/solid';
import { Post, AlertLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

type FilterState = {
  posts: boolean;
  shelters: boolean;
  camps: boolean;
  riskAreas: boolean;
};
type WeatherLayer = 'temp' | 'clouds' | 'precipitation' | null;

const alertLevelStyles: { [key in AlertLevel]: { bar: string; text: string; } } = {
  [AlertLevel.Critical]: { bar: 'bg-red-500', text: 'text-red-600 font-semibold' },
  [AlertLevel.Warning]: { bar: 'bg-yellow-500', text: 'text-yellow-600 font-semibold' },
  [AlertLevel.Info]: { bar: 'bg-blue-500', text: 'text-blue-600' },
  [AlertLevel.Safe]: { bar: 'bg-green-500', text: 'text-green-600' },
};

const ALERT_COLORS = {
    [AlertLevel.Critical]: '#EF4444',
    [AlertLevel.Warning]: '#FBBF24',
    [AlertLevel.Safe]: '#22C55E',
    [AlertLevel.Info]: '#3B82F6',
};

const MapView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [filters, setFilters] = useState<FilterState>({ posts: true, shelters: true, camps: true, riskAreas: true });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState('All India');
  const [isHeatmapVisible, setHeatmapVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('layers');
  const [activeWeatherLayer, setActiveWeatherLayer] = useState<WeatherLayer>(null);
  const [isCycloneVisible, setIsCycloneVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isFeedOpen, setIsFeedOpen] = useState(true);
  const [activeFeedTab, setActiveFeedTab] = useState('all');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleVerifyPost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(p => p.id === postId ? { ...p, isVerified: true } : p)
    );
  };

  const sortedPosts = useMemo(() => {
    // Fix: Use the getTime() method for robust date comparison. This explicitly
    // converts Date objects to numbers, resolving potential arithmetic type errors.
    return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);

  const verifiedPosts = useMemo(() => {
    return sortedPosts.filter(post => post.isVerified);
  }, [sortedPosts]);
  
  const filteredData = useMemo(() => {
    if (selectedState === 'All India') {
      return { posts: posts, shelters: mockSafeShelters, camps: mockMedicalCamps, riskAreas: mockRiskAreas };
    }
    return {
      posts: posts.filter(p => p.location.state === selectedState),
      shelters: mockSafeShelters.filter(s => s.location.state === selectedState),
      camps: mockMedicalCamps.filter(c => c.location.state === selectedState),
      riskAreas: mockRiskAreas.filter(r => r.location.state === selectedState),
    };
  }, [selectedState, posts]);

  const postsByDistrict = useMemo(() => {
    const counts = filteredData.posts.reduce((acc, post) => {
      const district = post.location.district || 'Unknown';
      acc[district] = (acc[district] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, posts]) => ({ name, posts })).sort((a, b) => b.posts - a.posts);
  }, [filteredData.posts]);

  const postsByAlertLevel = useMemo(() => {
    const alertCounts = { [AlertLevel.Critical]: 0, [AlertLevel.Warning]: 0, [AlertLevel.Safe]: 0, [AlertLevel.Info]: 0 };
    filteredData.posts.forEach(post => { alertCounts[post.alertLevel]++; });
    return Object.entries(alertCounts).map(([name, value]) => ({ name, value }));
  }, [filteredData.posts]);

  const filterOptions = [
    { name: 'posts', label: 'User Posts', icon: <UserCircleIcon className="h-5 w-5 text-blue-500" /> },
    { name: 'shelters', label: 'Safe Shelters', icon: <HomeModernIcon className="h-5 w-5 text-green-600" /> },
    { name: 'camps', label: 'Medical Camps', icon: <PlusCircleIcon className="h-5 w-5 text-red-600" /> },
    { name: 'riskAreas', label: 'Risk Areas', icon: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" /> },
  ];
  
  const ControlTabButton = ({ id, label, icon }: {id: string, label: string, icon: React.ReactNode}) => (
    <button onClick={() => setActiveTab(id)} className={`flex-1 flex items-center justify-center p-3 text-sm font-semibold border-b-2 transition-colors duration-200 ${activeTab === id ? 'border-incois-red text-incois-red' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
        {icon} <span className="ml-2">{label}</span>
    </button>
  );

  const FeedTabButton = ({ id, label }: {id: 'all' | 'verified', label: string}) => (
    <button onClick={() => setActiveFeedTab(id)} className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200 ${activeFeedTab === id ? 'text-incois-red border-b-2 border-incois-red' : 'text-gray-500 hover:bg-gray-100/50'}`}>
      {label}
    </button>
  );

  const postsToDisplay = activeFeedTab === 'all' ? sortedPosts : verifiedPosts;

  return (
    <div className="relative w-full h-full">
      <InteractiveMap
        posts={filteredData.posts}
        heatmapPosts={filteredData.posts.filter(p => p.isVerified)}
        users={mockUsers}
        shelters={filteredData.shelters}
        camps={filteredData.camps}
        riskAreas={filteredData.riskAreas}
        filters={filters}
        center={[20.5937, 78.9629]}
        zoom={5}
        enableClustering={true}
        selectedPostId={selectedPostId}
        onPopupClose={() => setSelectedPostId(null)}
        isHeatmapVisible={isHeatmapVisible}
        isCycloneVisible={isCycloneVisible}
        bounds={indianStates[selectedState]?.bounds}
        weatherLayer={activeWeatherLayer}
      />
      
      {!isFeedOpen && (
        <button
            onClick={() => setIsFeedOpen(true)}
            className="absolute top-4 left-4 z-[1000] bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-xl hover:bg-white"
            aria-label="Open live feed"
        >
            <QueueListIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div className={`absolute top-4 left-4 z-[1000] bg-white/80 backdrop-blur-md rounded-lg shadow-xl w-96 h-[calc(100%-2rem)] flex flex-col border border-gray-200/50 transition-all duration-300 ease-in-out ${isFeedOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-800">Live Feed</h3>
            <button
                onClick={() => setIsFeedOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200/80 hover:text-gray-800 transition-colors"
                aria-label="Close live feed"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="flex border-b border-gray-200/80">
          <FeedTabButton id="all" label={`All Posts (${sortedPosts.length})`} />
          <FeedTabButton id="verified" label={`Verified (${verifiedPosts.length})`} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {postsToDisplay.map(post => (
            <div key={post.id} onClick={() => { setSelectedPostId(post.id); setSelectedState(post.location.state); }} className={`flex p-4 border-b border-gray-100/80 cursor-pointer hover:bg-gray-50/50 transition-colors duration-150 ${selectedPostId === post.id ? 'bg-gray-200/60' : ''}`}>
              <div className={`w-1.5 rounded-full ${alertLevelStyles[post.alertLevel].bar} mr-3 flex-shrink-0`}></div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={mockUsers.find(u => u.id === post.authorId)?.avatar} alt="" className="w-8 h-8 rounded-full mr-2"/>
                    <p className="text-sm font-semibold text-gray-800">{post.author}</p>
                    {post.isVerified && <CheckBadgeIcon className="h-5 w-5 text-blue-500 ml-1.5" title="Verified Post"/>}
                  </div>
                  <span className={`text-xs ${alertLevelStyles[post.alertLevel].text}`}>{post.alertLevel}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{post.description}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                    {post.location.name}
                </p>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
                    {!post.isVerified && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleVerifyPost(post.id);
                            }}
                            className="text-xs font-semibold text-green-700 hover:text-white bg-green-100 hover:bg-green-600 px-2 py-1 rounded-md flex items-center transition-all duration-200"
                            aria-label={`Verify post from ${post.author}`}
                        >
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            Verify
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isDrawerOpen && (
        <button
            onClick={() => setIsDrawerOpen(true)}
            className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-xl hover:bg-white"
            aria-label="Open map controls"
        >
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div className={`absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md rounded-lg shadow-xl w-[450px] h-[calc(100%-2rem)] flex flex-col border border-gray-200/50 transition-all duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200/80 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-800">Map Controls</h3>
            <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200/80 hover:text-gray-800 transition-colors"
                aria-label="Close map controls"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="flex border-b border-gray-200/80 flex-shrink-0">
            <ControlTabButton id="layers" label="Layers" icon={<MapIcon className="w-5 h-5"/>}/>
            <ControlTabButton id="analytics" label="Analytics" icon={<ChartPieIcon className="w-5 h-5"/>}/>
            <ControlTabButton id="weather" label="Weather" icon={<CloudIcon className="w-5 h-5"/>}/>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'layers' && (
                <div className="space-y-6">
                    <div>
                        <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-2">State Filter</label>
                        <select id="state-filter" value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red">
                            {Object.keys(indianStates).map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-base">Map Legend & Filters</h4>
                        <div className="space-y-3">
                            {filterOptions.map(option => (
                                <label key={option.name} htmlFor={option.name} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-200/50">
                                    <input type="checkbox" id={option.name} name={option.name} checked={filters[option.name as keyof FilterState]} onChange={handleFilterChange} className="h-5 w-5 rounded border-gray-300 text-incois-red focus:ring-incois-red"/>
                                    <div className="flex items-center">{option.icon}<span className="ml-2 text-sm font-medium text-gray-700">{option.label}</span></div>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-base">Data Visualization</h4>
                        <label htmlFor="heatmap" className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-200/50">
                           <div className="flex items-center">
                            <FireIcon className="h-5 w-5 text-orange-500" />
                            <span className="ml-2 text-sm font-medium text-gray-700">Verified Post Density Heatmap</span>
                           </div>
                           <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="heatmap" className="sr-only peer" checked={isHeatmapVisible} onChange={e => setHeatmapVisible(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-incois-red/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-incois-red"></div>
                           </div>
                        </label>
                    </div>
                </div>
            )}
            {activeTab === 'analytics' && (
                 <div className="space-y-6">
                    {selectedState !== 'All India' && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-3 text-base">Map Overview for {selectedState}</h4>
                            <div className="bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                                <StateInsetMap 
                                    posts={filteredData.posts} 
                                    stateName={selectedState}
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-base">Posts by District ({selectedState})</h4>
                        <div className="h-64 w-full">{postsByDistrict.length > 0 ? <ResponsiveContainer><BarChart data={postsByDistrict} layout="vertical" margin={{ top: 5, right: 20, left: 70, bottom: 5 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} width={60} /><Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}/><Bar dataKey="posts" fill="#DC2626" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer> : <p className="text-center text-gray-500 pt-20">No data for this state.</p>}</div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-base">Posts by Alert Level ({selectedState})</h4>
                        <div className="h-64 w-full">{filteredData.posts.length > 0 ? <ResponsiveContainer><PieChart><Pie data={postsByAlertLevel} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{postsByAlertLevel.map((entry, index) => (<Cell key={`cell-${index}`} fill={ALERT_COLORS[entry.name as AlertLevel]} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> : <p className="text-center text-gray-500 pt-20">No data for this state.</p>}</div>
                    </div>
                </div>
            )}
            {activeTab === 'weather' && (
                <div className="space-y-6">
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-base">Weather Overlays</h4>
                        <p className="text-xs text-gray-500 mb-4">Select a weather layer to display on the map. (Powered by OpenWeatherMap)</p>
                        <div className="space-y-2">
                            {['temp', 'clouds', 'precipitation'].map(layer => (
                                <button key={layer} onClick={() => setActiveWeatherLayer(prev => prev === layer ? null : layer as WeatherLayer)} className={`w-full text-left p-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${activeWeatherLayer === layer ? 'bg-incois-red text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    <span className={`w-3 h-3 rounded-full mr-3 ${activeWeatherLayer === layer ? 'bg-white' : 'bg-gray-400'}`}></span>
                                    {layer.charAt(0).toUpperCase() + layer.slice(1)}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-4 italic">Note: Live weather layers require an API key in a production environment.</p>
                     </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-base">Simulations</h4>
                        <label htmlFor="cyclone" className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-200/50">
                           <div className="flex items-center">
                            <BeakerIcon className="h-5 w-5 text-purple-500" />
                            <span className="ml-2 text-sm font-medium text-gray-700">Cyclone Activity</span>
                           </div>
                           <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="cyclone" className="sr-only peer" checked={isCycloneVisible} onChange={e => setIsCycloneVisible(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-incois-red/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-incois-red"></div>
                           </div>
                        </label>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MapView;