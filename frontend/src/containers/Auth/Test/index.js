// import React, { Component } from "react";

// class YoutubePlayer extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             player: null,
//             playedPercentage: 0,
//         };

//         this.playerRef = React.createRef();
//     }

//     componentDidMount() {
//         // Tạo player
//         const tag = document.createElement("script");
//         tag.src = "https://www.youtube.com/iframe_api";
//         const firstScriptTag = document.getElementsByTagName("script")[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//         window.onYouTubeIframeAPIReady = () => {
//             const newPlayer = new window.YT.Player(this.playerRef.current, {
//                 videoId: "gJHSDZfJrRY",
//                 events: {
//                     onStateChange: (event) => {
//                         if (event.data === window.YT.PlayerState.PLAYING) {
//                             // Lắng nghe sự kiện khi player đang phát
//                             const duration = this.state.player.getDuration();
//                             setInterval(() => {
//                                 const currentTime = this.state.player.getCurrentTime();
//                                 const percentage = (currentTime / duration) * 100;
//                                 this.setState({ playedPercentage: percentage });
//                             }, 1000);
//                         }
//                     },
//                 },
//             });
//             this.setState({ player: newPlayer });
//         };
//     }

//     render() {
//         return (
//             <div>
//                 <div ref={this.playerRef}>
//                     <iframe
//                         width="560"
//                         height="315"
//                         src="https://www.youtube.com/embed/gJHSDZfJrRY"
//                         title="YouTube video player"
//                         frameborder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                         allowfullscreen
//                     ></iframe>
//                 </div>
//                 <div>{this.state.playedPercentage.toFixed(2)}%</div>
//             </div>
//         );
//     }
// }

// export default YoutubePlayer;

import React, { Component } from 'react';
import YouTube from 'react-youtube';

class YoutubeVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            timerId: null
        }
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
    }

    onPlay(event) {
        console.log('play');
        const timerId = setInterval(() => {
            this.setState({ time: this.state.time + 1 });
        }, 1000);
        this.setState({ timerId });
    }

    onPause(event) {
        console.log('pause');
        clearInterval(this.state.timerId);
        this.setState({ timerId: null });
    }

    render() {
        const opts = {
            height: '315',
            width: '560',
            playerVars: {
                autoplay: 1,
                controls: 1,
            },
        };

        return (
            <div>
                <YouTube videoId="LxNzRN8EMcw" opts={opts} onPlay={this.onPlay} onPause={this.onPause} />
                <div>
                    {this.state.time} seconds
                </div>
            </div>
        );
    }
}

export default YoutubeVideo;