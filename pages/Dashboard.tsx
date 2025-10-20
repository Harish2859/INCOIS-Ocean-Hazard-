import React from 'react';
import { mockPosts, mockRecentActivities, mockUsers, mockSafeShelters, mockMedicalCamps, mockRiskAreas } from '../constants';
import DataCard from '../components/DataCard';
import { UsersIcon, DocumentTextIcon, ExclamationTriangleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { AlertLevel } from '../types';
import InteractiveMap from '../components/InteractiveMap';


const Dashboard: React.FC = () => {
    const totalPostsToday = mockPosts.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString()).length;
    const criticalAlerts = mockPosts.filter(p => p.alertLevel === AlertLevel.Critical).length;

    const dashboardMapFilters = {
        posts: true,
        shelters: false,
        camps: false,
        riskAreas: false,
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard title="Total Active Users" value={mockUsers.length.toString()} icon={<UsersIcon className="h-8 w-8 text-incois-red" />} change="+5" changeType="increase" />
                <DataCard title="Total Posts Today" value={totalPostsToday.toString()} icon={<DocumentTextIcon className="h-8 w-8 text-incois-red" />} change="+12" changeType="increase" />
                <DataCard title="New Critical Alerts" value={criticalAlerts.toString()} icon={<ExclamationTriangleIcon className="h-8 w-8 text-incois-red" />} change="-2" changeType="decrease" />
                <DataCard title="Pending Reports" value="8" icon={<ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-incois-red" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Post Locations</h3>
                    <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                        {/* Fix: Pass all required props to InteractiveMap to resolve TypeScript error. */}
                        <InteractiveMap 
                            posts={mockPosts} 
                            users={mockUsers} 
                            shelters={mockSafeShelters}
                            camps={mockMedicalCamps}
                            riskAreas={mockRiskAreas}
                            filters={dashboardMapFilters}
                            center={[20.5937, 78.9629]} 
                            zoom={5} 
                            enableClustering={false} 
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity Feed</h3>
                    <ul className="space-y-4">
                        {mockRecentActivities.map(activity => (
                            <li key={activity.id} className="flex items-start">
                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-incois-red rounded-full"></div>
                                <div className="ml-3">
                                    <p className="text-sm text-gray-700">{activity.description}</p>
                                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;