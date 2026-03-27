import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const STEMCircuitsGame = ({ onGameComplete, onProgressUpdate }) => {
    const [level, setLevel] = useState(1);
    const [nodes, setNodes] = useState([]);
    const [isWon, setIsWon] = useState(false);
    const [hint, setHint] = useState(null);

    const levels = [
        {
            id: 1,
            title: 'SIMPLE CIRCUIT',
            description: 'Flip the switch to power the bulb! Energy flows through the wires.',
            nodes: [
                { id: 's1', type: 'switch', label: 'SW-1', state: false, x: 100, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 200 }
            ],
            links: [{ from: 's1', to: 'light' }]
        },
        {
            id: 2,
            title: 'AND LOGIC',
            description: 'The AND gate needs BOTH switches to be ON to output power.',
            nodes: [
                { id: 's1', type: 'switch', label: 'A', state: false, x: 100, y: 150 },
                { id: 's2', type: 'switch', label: 'B', state: false, x: 100, y: 250 },
                { id: 'g1', type: 'gate', gateType: 'AND', label: 'AND', state: false, x: 300, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'light' }
            ]
        },
        {
            id: 3,
            title: 'OR LOGIC',
            description: 'The OR gate needs ANY switch to be ON to output power.',
            nodes: [
                { id: 's1', type: 'switch', label: 'A', state: false, x: 100, y: 150 },
                { id: 's2', type: 'switch', label: 'B', state: false, x: 100, y: 250 },
                { id: 'g1', type: 'gate', gateType: 'OR', label: 'OR', state: false, x: 300, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'light' }
            ]
        },
        {
            id: 4,
            title: 'NOT GATE (INVERTER)',
            description: 'The NOT gate flips the signal! ON becomes OFF, and OFF becomes ON.',
            nodes: [
                { id: 's1', type: 'switch', label: 'SW', state: true, x: 100, y: 200 },
                { id: 'g1', type: 'gate', gateType: 'NOT', label: 'NOT', state: false, x: 300, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 'g1', to: 'light' }
            ]
        },
        {
            id: 5,
            title: 'THE DOUBLE NEGATIVE',
            description: 'What happens when you use two NOT gates? Power the bulb!',
            nodes: [
                { id: 's1', type: 'switch', label: 'S', state: false, x: 50, y: 200 },
                { id: 'g1', type: 'gate', gateType: 'NOT', label: 'NOT 1', state: false, x: 200, y: 200 },
                { id: 'g2', type: 'gate', gateType: 'NOT', label: 'NOT 2', state: false, x: 350, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 'g1', to: 'g2' },
                { from: 'g2', to: 'light' }
            ]
        },
        {
            id: 6,
            title: 'NAND LOGIC',
            description: 'NAND stands for NOT-AND. It outputs ON unless BOTH inputs are ON.',
            nodes: [
                { id: 's1', type: 'switch', label: 'A', state: false, x: 100, y: 150 },
                { id: 's2', type: 'switch', label: 'B', state: false, x: 100, y: 250 },
                { id: 'g1', type: 'gate', gateType: 'AND', label: 'AND', state: false, x: 250, y: 200 },
                { id: 'g2', type: 'gate', gateType: 'NOT', label: 'NOT', state: false, x: 400, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 550, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'g2' },
                { from: 'g2', to: 'light' }
            ]
        },
        {
            id: 7,
            title: 'XOR (EXCLUSIVE OR)',
            description: 'XOR outputs ON if exactly ONE input is ON, but NOT both!',
            nodes: [
                { id: 's1', type: 'switch', label: 'A', state: false, x: 100, y: 150 },
                { id: 's2', type: 'switch', label: 'B', state: false, x: 100, y: 250 },
                { id: 'g1', type: 'gate', gateType: 'XOR', label: 'XOR', state: false, x: 300, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'light' }
            ]
        },
        {
            id: 8,
            title: 'SYSTEM OVERRIDE',
            description: 'Combine AND and OR to reach the target light.',
            nodes: [
                { id: 's1', type: 'switch', label: 'A', state: false, x: 80, y: 100 },
                { id: 's2', type: 'switch', label: 'B', state: false, x: 80, y: 200 },
                { id: 's3', type: 'switch', label: 'C', state: false, x: 80, y: 300 },
                { id: 'g1', type: 'gate', gateType: 'AND', label: 'AND', state: false, x: 250, y: 150 },
                { id: 'g2', type: 'gate', gateType: 'OR', label: 'OR', state: false, x: 400, y: 250 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 550, y: 250 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'g2' },
                { from: 's3', to: 'g2' },
                { from: 'g2', to: 'light' }
            ]
        },
        {
            id: 9,
            title: 'LOGICAL MAZE',
            description: 'Three gates blocking the way. Think carefully!',
            nodes: [
                { id: 's1', type: 'switch', label: 'S1', state: false, x: 50, y: 100 },
                { id: 's2', type: 'switch', label: 'S2', state: false, x: 50, y: 300 },
                { id: 'g1', type: 'gate', gateType: 'NOT', label: 'NOT', state: false, x: 180, y: 100 },
                { id: 'g2', type: 'gate', gateType: 'AND', label: 'AND', state: false, x: 320, y: 200 },
                { id: 'g3', type: 'gate', gateType: 'OR', label: 'OR', state: false, x: 450, y: 250 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 550, y: 250 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 'g1', to: 'g2' },
                { from: 's2', to: 'g2' },
                { from: 'g2', to: 'g3' },
                { from: 's2', to: 'g3' },
                { from: 'g3', to: 'light' }
            ]
        },
        {
            id: 10,
            title: 'BINARY HALF-ADDER',
            description: 'Build a circuit where the light turns on ONLY when the sum is 1.',
            nodes: [
                { id: 's1', type: 'switch', label: 'BIT A', state: false, x: 100, y: 150 },
                { id: 's2', type: 'switch', label: 'BIT B', state: false, x: 100, y: 250 },
                { id: 'g1', type: 'gate', gateType: 'XOR', label: 'SUM', state: false, x: 350, y: 200 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 550, y: 200 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'light' }
            ]
        },
        {
            id: 11,
            title: 'TRIPLE AND CHALLENGE',
            description: 'All paths must lead to truth. Power the main frame!',
            nodes: [
                { id: 's1', type: 'switch', label: 'S1', state: false, x: 50, y: 100 },
                { id: 's2', type: 'switch', label: 'S2', state: false, x: 50, y: 200 },
                { id: 's3', type: 'switch', label: 'S3', state: false, x: 50, y: 300 },
                { id: 'g1', type: 'gate', gateType: 'AND', label: 'AND A', state: false, x: 200, y: 150 },
                { id: 'g2', type: 'gate', gateType: 'AND', label: 'AND B', state: false, x: 350, y: 220 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 500, y: 220 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 'g1', to: 'g2' },
                { from: 's3', to: 'g2' },
                { from: 'g2', to: 'light' }
            ]
        },
        {
            id: 12,
            title: 'THE FINAL GATE',
            description: 'Master all logic to solve the ultimate system puzzle!',
            nodes: [
                { id: 's1', type: 'switch', label: 'A', state: false, x: 50, y: 100 },
                { id: 's2', type: 'switch', label: 'B', state: false, x: 50, y: 200 },
                { id: 's3', type: 'switch', label: 'C', state: false, x: 50, y: 300 },
                { id: 'g1', type: 'gate', gateType: 'OR', label: 'OR', state: false, x: 180, y: 150 },
                { id: 'g2', type: 'gate', gateType: 'NOT', label: 'NOT', state: false, x: 300, y: 300 },
                { id: 'g3', type: 'gate', gateType: 'AND', label: 'AND', state: false, x: 420, y: 220 },
                { id: 'light', type: 'target', label: '💡', state: false, x: 550, y: 220 }
            ],
            links: [
                { from: 's1', to: 'g1' },
                { from: 's2', to: 'g1' },
                { from: 's3', to: 'g2' },
                { from: 'g1', to: 'g3' },
                { from: 'g2', to: 'g3' },
                { from: 'g3', to: 'light' }
            ]
        }
    ];

    const initLevel = () => {
        const l = levels[level - 1] || levels[0];
        setNodes(l.nodes.map(n => ({ ...n })));
        setIsWon(false);
        setHint(null);
    };

    useEffect(() => { initLevel(); }, [level]);

    const toggleSwitch = (id) => {
        const newNodes = nodes.map(n => n.id === id ? { ...n, state: !n.state } : n);
        updateCircuit(newNodes);
    };

    const updateCircuit = (currentNodes) => {
        let updated = [...currentNodes];
        const links = levels[level - 1].links;

        // Simple propogation (for small circuits)
        for (let i = 0; i < 3; i++) { // Max 3 passes to stabilize
            updated = updated.map(node => {
                if (node.type === 'switch') return node;

                const inputs = links.filter(l => l.to === node.id).map(l =>
                    updated.find(n => n.id === l.from).state
                );

                let newState = false;
                if (node.type === 'target') newState = inputs.some(i => i);
                if (node.gateType === 'AND') newState = inputs.length > 0 && inputs.every(i => i);
                if (node.gateType === 'OR') newState = inputs.some(i => i);
                if (node.gateType === 'NOT') newState = inputs.length > 0 && !inputs[0];
                if (node.gateType === 'XOR') newState = inputs.length === 2 && inputs[0] !== inputs[1];

                return { ...node, state: newState };
            });
        }

        setNodes(updated);
        if (updated.find(n => n.type === 'target')?.state) {
            setTimeout(() => {
                setIsWon(true);
                onProgressUpdate?.(33);
            }, 600);
        }
    };

    return (
        <div className="w-full h-full bg-slate-950/80 rounded-[2rem] p-10 flex flex-col border border-blue-500/30 shadow-2xl relative overflow-hidden font-mono text-white backdrop-blur-md">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <div className="flex justify-between items-center z-10 mb-6">
                <div>
                    <h2 className="text-4xl font-black text-blue-400 italic tracking-tighter game-text-shadow">LOGIC_FLOW_STATION</h2>
                    <p className="text-blue-500/60 font-black text-xs cyber-text tracking-[0.2em]">MISSION: LEVEL_{level} • {levels[level - 1]?.title}</p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 shadow-inner flex flex-col items-end">
                    <div className="text-[10px] cyber-text text-slate-500 mb-1">CIRCUIT_STATE</div>
                    <div className={`text-xl font-black cyber-text ${nodes.find(n => n.type === 'target')?.state ? 'text-emerald-400 drop-shadow-[0_0_8px_#10b981]' : 'text-rose-500'}`}>
                        {nodes.find(n => n.type === 'target')?.state ? 'CONNECTED' : 'OPEN_LOOP'}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative z-10 bg-slate-900/50 rounded-3xl border-2 border-slate-800 m-4 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                    {levels[level - 1]?.links.map((link, i) => {
                        const fromNode = nodes.find(n => n.id === link.from);
                        const toNode = nodes.find(n => n.id === link.to);
                        if (!fromNode || !toNode) return null;
                        return (
                            <motion.line key={i} x1={fromNode.x + 40} y1={fromNode.y + 40} x2={toNode.x + 40} y2={toNode.y + 40}
                                stroke={fromNode.state ? '#60a5fa' : '#334155'} strokeWidth="6" strokeLinecap="round" />
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <motion.div key={node.id} animate={{ scale: node.state ? 1.1 : 1 }}
                        style={{ left: node.x, top: node.y }}
                        onClick={() => node.type === 'switch' && toggleSwitch(node.id)}
                        className={`absolute w-20 h-20 rounded-2xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${node.state ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.4)]' : 'bg-slate-800 border-slate-700'}`}>
                        <span className={`text-3xl mb-1 ${node.type === 'target' && node.state ? 'drop-shadow-[0_0_10px_yellow]' : ''}`}>
                            {node.label}
                        </span>
                        <div className={`text-[10px] font-black rounded px-2 ${node.state ? 'bg-blue-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                            {node.state ? 'ON' : 'OFF'}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-blue-500/20 z-10 flex justify-between items-center backdrop-blur-sm">
                <p className="text-slate-300 font-bold text-center flex-1 italic game-text-shadow">OBJECTIVE: {levels[level - 1]?.description}</p>
                <Button variant="outline" onClick={() => setHint('ANALYZING_LOGIC_GATES...')} className="border-blue-500/30 text-blue-400 cyber-text">REQUEST_INTEL</Button>
            </div>

            {isWon && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-8">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center console-panel p-16 border-t-8 border-t-emerald-500 max-w-xl">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-emerald-500" />
                            <span className="text-[10px] cyber-text text-emerald-500 animate-pulse tracking-[0.5em]">SYSTEM_STABILIZED</span>
                            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-emerald-500" />
                        </div>
                        <div className="bg-emerald-500/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                            <Icon name="Zap" size={60} className="text-emerald-500 animate-pulse" />
                        </div>
                        <h2 className="text-6xl font-black text-white mb-2 tracking-tighter italic game-text-shadow">POWER_RESTORED</h2>
                        <p className="text-xl text-emerald-400/70 mb-10 font-bold cyber-text tracking-[0.3em]">LOGIC_STREAM_STABILIZED_V2.4</p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-3 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                                <span className="block text-[8px] cyber-text text-slate-500 mb-1">DATA_EXTRACTED</span>
                                <span className="block text-xl font-black text-white">+250_XP</span>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                                <span className="block text-[8px] cyber-text text-slate-500 mb-1">CORE_INTEGRITY</span>
                                <span className="block text-xl font-black text-white">100.0%</span>
                            </div>
                        </div>

                        <Button onClick={() => level < levels.length ? setLevel(level + 1) : onGameComplete?.()} size="lg" className="w-full h-16 text-xl bg-blue-600 hover:bg-blue-500 cyber-text shadow-[0_0_20px_rgba(59,130,246,0.3)]">CONTINUE_MISSION</Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default STEMCircuitsGame;
