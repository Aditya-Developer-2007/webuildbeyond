import React from 'react';

export default function Preloader() {
  return (
    <div style={styles.container}>
      <div style={styles.imgWrapper}>
        <img src="/Logo.png" alt="Loading..." style={styles.logo} />
        <div style={styles.ring}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    background: '#FCFCFD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  imgWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
  },
  logo: {
    height: 70,
    objectFit: 'contain',
    animation: 'pulseLogo 2s ease-in-out infinite',
    zIndex: 2,
  },
  ring: {
    position: 'absolute',
    inset: 0,
    border: '3px solid transparent',
    borderTopColor: '#6C63FF',
    borderRightColor: '#9333ea',
    borderRadius: '50%',
    animation: 'spinRing 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
    zIndex: 1,
  }
};
