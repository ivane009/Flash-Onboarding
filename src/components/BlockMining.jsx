import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BlockMining = () => {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const lastBlockRef = useRef(null);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const res = await axios.get('https://blockchain.info/latestblock');
        const blockHeight = res.data.height;
        if (lastBlockRef.current !== blockHeight) {
          lastBlockRef.current = blockHeight;
          addBlock(blockHeight);
        }
      } catch (err) {
        setError('Connection failed');
      }
    };

    const addBlock = (height) => {
      const newBlock = {
        id: Date.now(),
        height,
        hash: height.toString(),
      };

      setBlocks(prev => {
        const updated = [newBlock, ...prev];
        if (updated.length > 6) {
          return updated.slice(0, 6);
        }
        return updated;
      });
    };

    fetchLatestBlock();
    const interval = setInterval(fetchLatestBlock, 60000);

    try {
      wsRef.current = new WebSocket('wss://ws.blockchain.info/inv');

      wsRef.current.onopen = () => {
        wsRef.current.send(JSON.stringify({ op: 'blocks_sub' }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.op === 'utx' && data.x) {
            const blockHeight = data.x.block_height;
            if (lastBlockRef.current !== blockHeight) {
              lastBlockRef.current = blockHeight;
              addBlock(blockHeight);
            }
          }
        } catch (e) {}
      };

      wsRef.current.onerror = () => {
        setError('WebSocket error');
      };
    } catch (e) {}

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const cubeVariants = {
    initial: { scale: 0, opacity: 0, rotate: -10 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: {
      x: -100,
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  return (
    <div style={{
      width: '480px',
      minWidth: '480px',
      height: '860px',
      background: '#0d0d0d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(247, 147, 26, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <h2 style={{
        color: '#F7931A',
        fontFamily: 'Syne, sans-serif',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '40px',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        Bitcoin Mining
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        position: 'relative'
      }}>
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => (
            <div key={block.id} style={{ position: 'relative' }}>
              {index > 0 && (
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '25px',
                    background: 'linear-gradient(to bottom, #F7931A, rgba(247, 147, 26, 0.3))'
                  }}
                />
              )}

              <motion.div
                variants={cubeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
                  border: '2px solid #F7931A',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px #F7931A, 0 0 40px rgba(247, 147, 26, 0.3), inset 0 0 15px rgba(247, 147, 26, 0.1)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease'
                }}
                whileHover={{
                  boxShadow: '0 0 30px #F7931A, 0 0 60px rgba(247, 147, 26, 0.5), inset 0 0 20px rgba(247, 147, 26, 0.2)',
                  scale: 1.05
                }}
              >
                <span style={{
                  color: '#F7931A',
                  fontSize: '9px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  opacity: 0.7
                }}>
                  BLOCK
                </span>
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Syne, sans-serif'
                }}>
                  #{block.height?.toLocaleString() || '---'}
                </span>
                <span style={{
                  color: '#4dd9c0',
                  fontSize: '8px',
                  marginTop: '2px'
                }}>
                  ⚡ MINED
                </span>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {blocks.length === 0 && !error && (
        <div style={{
          color: 'rgba(247, 147, 26, 0.5)',
          fontSize: '14px',
          marginTop: '20px'
        }}>
          Waiting for blocks...
        </div>
      )}

      {error && (
        <div style={{
          color: '#ef4444',
          fontSize: '12px',
          marginTop: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        position: 'absolute',
        bottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '11px'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#22c55e',
          animation: 'pulse 2s infinite'
        }} />
        Live Blockchain
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default BlockMining;
