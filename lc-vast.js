function resetPlayer() {
        $('.ad-element').hide();
        $('#player').removeClass('ads');
        videojs("player").src({
            type: "video/mp4",
            src: "http://video-js.zencoder.com/oceans-clip.mp4"
        });
        AD_COMPLETED = true;
        videojs("player").play();
    }
    $(function() {
          videoPlayer =   videojs("player", {}, function() {
                // Player (this) is initialized and ready.
            });
        $('#player').addClass('ads');
        $('.skipAdButton').on('click', function() {
            videojs("player").pause();
            if (skipEnabled) {
                resetPlayer();
                LiveRailVPAID.skipAd();
            }
        });
        try {
            LiveRailVPAID = getVPAIDAd();
            LiveRailVPAID.handshakeVersion('2.0');
            var creativeData = {},
                environmentVars = {
                    slot: player,
                    videoSlot: player_html5_api,
                    videoSlotCanAutoPlay: true,
                    adSkippableState: true,
                    LR_PUBLISHER_ID: 1331,
                    LR_TAGS: 'demo',
                    LR_MUTED: 1,
                    LR_DEBUG: 1,
                    LR_VIDEO_ID: 'uuid-123',
                    LR_LAYOUT_SKIP_MESSAGE: 'Advertisement. Video will resume in {COUNTDOWN} seconds.',
                };
            //Initializean ad

            LiveRailVPAID.initAd(player_html5_api.offsetWidth, player_html5_api.offsetHeight, 'normal', 512, creativeData, environmentVars);
            LiveRailVPAID.subscribe(function() {
                AD_COMPLETED = false;
                setTimeout(function() {
                    LiveRailVPAID.startAd();
                    $('.ad-element').show();
                    videojs("player").on("timeupdate", function() {
                        var current_time = Math.ceil(videoPlayer.currentTime());
                        if (current_time < 5) {
                            $('.skipAdButton').html('Skip in ' + (5 - current_time));
                        } else {
                            skipEnabled = true;
                            $('.skipAdButton').html('Skip Ad');
                            $('.skipAdButton').attr('id', 'skipAd');
                        }
                    });
                    console.log('ad loaded');
                }, 100);

            }, 'AdLoaded');
            LiveRailVPAID.subscribe(function() {
                resetPlayer()
            }, 'AdStopped');
            LiveRailVPAID.subscribe(function() {
                resetPlayer()
            }, 'AdError');
            LiveRailVPAID.subscribe(function(message) {
                console.log(message);
            }, 'AdLog');
            LiveRailVPAID.subscribe(function(message) {
                console.log('------------ complete');
            }, 'AdComplete');
        } catch (ex) {
            console.log( ex );
            $('.ad-element').hide();
            $('#player').removeClass('ads');
            AD_COMPLETED = true;
            videojs("player").play();
        }
    });