import styles from './style.module.scss';
import TextEditor from '../TextEditor';

export default function Splash(){
  return (
    <div className={styles.chatArea}>
      <div className={styles.topArea}></div>
      <div className={styles.bottomArea}>
        <TextEditor textTo='Message Log Rocket Updates' />
      </div>
    </div>
  );
}
