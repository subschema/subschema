module.exports = {
    rollUp: {
        transitionAppearTimeout: 800,
        transitionEnterTimeout: 800,
        transitionLeaveTimeout: 800,
        transitionName: {
            enter: 'rollUpEnter',
            enterActive: 'rollUpActive',
            leave: 'rollUpLeave',
            leaveActive: 'rollUpLeaveACtive',
            appear: 'rollUpAppear',
            appearActive: 'rollUpAppearActive'
        }


    },
    slideLeft: {
        transitionAppearTimeout: 500,
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 500,
        transitionHeightClass: 'transitionHeightClass',
        transitionName: {
            enter: 'slideLeftEnter',
            enterActive: 'slideLeftActive',
            leave: 'slideLeftLeave',
            leaveActive: 'slideLeftLeaveActive',
            appear: 'slideLeftAppear',
            appearActive: 'slideLeftAppearActive'
        }
    },
    slideRight: {
        transitionAppearTimeout: 500,
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 500,
        transitionHeightClass: 'transitionHeightClass',
        transitionName: {
            enter: 'slideRightEnter',
            enterActive: 'slideRightActive',
            leave: 'slideRightLeave',
            leaveActive: 'slideRightLeaveACtive',
            appear: 'slideRightAppear',
            appearActive: 'slideRightAppearActive'
        }
    }
};