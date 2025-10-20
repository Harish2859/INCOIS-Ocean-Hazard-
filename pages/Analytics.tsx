
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Sector } from 'recharts';
import { mockUsers, mockPosts } from '../constants';
import { UserRole, AlertLevel } from '../types';

const userGrowthData = [
    { name: 'Jan', users: 120 },
    { name: 'Feb', users: 150 },
    { name: 'Mar', users: 210 },
    { name: 'Apr', users: 250 },
    { name: 'May', users: 310 },
    { name: 'Jun', users: 380 },
    { name: 'Jul', users: 450 },
];

const postsByDayData = [
    { name: 'Mon', posts: 22 },
    { name: 'Tue', posts: 35 },
    { name: 'Wed', posts: 18 },
    { name: 'Thu', posts: 45 },
    { name: 'Fri', posts: 50 },
    { name: 'Sat', posts: 60 },
    { name: 'Sun', posts: 42 },
];

const usersByRoleData = [
    { name: 'Admin', value: mockUsers.filter(u => u.role === UserRole.Admin).length },
    { name: 'Volunteer', value: mockUsers.filter(u => u.role === UserRole.Volunteer).length },
    { name: 'Citizen', value: mockUsers.filter(u => u.role === UserRole.Citizen).length },
];

const postsByAlertData = [
    { name: 'Critical', value: mockPosts.filter(p => p.alertLevel === AlertLevel.Critical).length },
    { name: 'Warning', value: mockPosts.filter(p => p.alertLevel === AlertLevel.Warning).length },
    { name: 'Safe', value: mockPosts.filter(p => p.alertLevel === AlertLevel.Safe).length },
    { name: 'Info', value: mockPosts.filter(p => p.alertLevel === AlertLevel.Info).length },
]

const COLORS_ROLE = ['#DC2626', '#16A34A', '#2563EB'];
const COLORS_ALERT = ['#EF4444', '#FBBF24', '#22C55E', '#3B82F6'];

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};


const Analytics: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md h-96">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Over Time</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#DC2626" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md h-96">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Posts Per Day</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={postsByDayData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#DC2626" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md h-96">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution of Users by Role</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={usersByRoleData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {usersByRoleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_ROLE[index % COLORS_ROLE.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md h-96">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution of Posts by Alert Type</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                         <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={postsByAlertData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#DC2626"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                         >
                             {postsByAlertData.map((entry, index) => (
                                <Cell key={`cell-alert-${index}`} fill={COLORS_ALERT[index % COLORS_ALERT.length]} />
                            ))}
                         </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
