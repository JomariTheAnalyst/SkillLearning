"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Check, ChevronRight } from "lucide-react";

type SkillNode = {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  progress: number;
  position: { x: number; y: number };
  children: string[];
  level: number;
  xpRequired: number;
  imageUrl?: string;
};

type SkillTreeProps = {
  treeId?: string;
  userId?: string;
};

export function SkillTree({ treeId, userId }: SkillTreeProps) {
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the skill tree
    const fetchSkillTree = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data for the skill tree
        const mockNodes: SkillNode[] = [
          {
            id: "node1",
            name: "SQL Basics",
            description: "Learn the fundamentals of SQL including SELECT statements and basic queries.",
            isUnlocked: true,
            progress: 100,
            position: { x: 50, y: 50 },
            children: ["node2", "node3"],
            level: 1,
            xpRequired: 0
          },
          {
            id: "node2",
            name: "SQL Joins",
            description: "Master different types of JOIN operations to combine data from multiple tables.",
            isUnlocked: true,
            progress: 65,
            position: { x: 150, y: 120 },
            children: ["node4"],
            level: 2,
            xpRequired: 100
          },
          {
            id: "node3",
            name: "SQL Filters",
            description: "Learn to filter data using WHERE, HAVING, and other clauses.",
            isUnlocked: true,
            progress: 40,
            position: { x: 250, y: 50 },
            children: ["node5"],
            level: 2,
            xpRequired: 100
          },
          {
            id: "node4",
            name: "SQL Subqueries",
            description: "Advanced techniques for using subqueries to solve complex problems.",
            isUnlocked: false,
            progress: 0,
            position: { x: 200, y: 200 },
            children: ["node6"],
            level: 3,
            xpRequired: 250
          },
          {
            id: "node5",
            name: "SQL Aggregations",
            description: "Learn to use GROUP BY and aggregate functions to summarize data.",
            isUnlocked: false,
            progress: 0,
            position: { x: 350, y: 120 },
            children: ["node6"],
            level: 3,
            xpRequired: 250
          },
          {
            id: "node6",
            name: "SQL Optimization",
            description: "Advanced techniques for optimizing SQL queries for performance.",
            isUnlocked: false,
            progress: 0,
            position: { x: 300, y: 280 },
            children: [],
            level: 4,
            xpRequired: 500
          }
        ];
        
        setNodes(mockNodes);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch skill tree:", error);
        setLoading(false);
      }
    };

    fetchSkillTree();
  }, [treeId, userId]);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
  };

  const renderConnections = () => {
    return nodes.map(node => {
      return node.children.map(childId => {
        const childNode = nodes.find(n => n.id === childId);
        if (!childNode) return null;
        
        const startX = node.position.x + 20;
        const startY = node.position.y + 20;
        const endX = childNode.position.x + 20;
        const endY = childNode.position.y + 20;
        
        // Calculate control points for a curved line
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2 - 20;
        
        return (
          <svg 
            key={`${node.id}-${childId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <path
              d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
              stroke={node.isUnlocked && childNode.isUnlocked ? "#4f46e5" : "#d1d5db"}
              strokeWidth="2"
              fill="none"
              strokeDasharray={!childNode.isUnlocked ? "5,5" : "none"}
            />
          </svg>
        );
      });
    }).flat();
  };

  const closeNodeDetails = () => {
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm h-[400px] animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-[300px] bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Skill Tree</h3>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Unlocked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></div>
            <span>Locked</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-[400px] bg-gray-50 dark:bg-gray-900/30 rounded-lg overflow-hidden">
        {renderConnections()}
        
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer
              ${node.isUnlocked 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            style={{
              left: node.position.x,
              top: node.position.y,
              boxShadow: node.isUnlocked ? '0 0 15px rgba(79, 70, 229, 0.5)' : 'none'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick(node)}
          >
            {node.isUnlocked ? (
              node.progress === 100 ? <Check size={20} /> : <ChevronRight size={20} />
            ) : (
              <Lock size={16} />
            )}
          </motion.div>
        ))}
        
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{selectedNode.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedNode.description}
                </p>
              </div>
              <button 
                onClick={closeNodeDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            {selectedNode.isUnlocked && selectedNode.progress < 100 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{selectedNode.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${selectedNode.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {!selectedNode.isUnlocked && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-100 dark:border-yellow-900/30 text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                  Requires Level {selectedNode.level} and {selectedNode.xpRequired} XP to unlock
                </p>
              </div>
            )}
            
            {selectedNode.isUnlocked && selectedNode.progress < 100 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
              >
                Continue Learning
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 