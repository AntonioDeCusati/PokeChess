import Phaser from 'phaser';

/**
 * Bridge between Phaser scenes and React components.
 * Phaser emits events here; React listens via useEffect.
 */
export const EventBus = new Phaser.Events.EventEmitter();
