"use strict";
import React, {Component} from 'react';

import {resolvers,  loader, injector} from 'Subschema';
import expect from 'expect';
const {transition} = resolvers;
describe("resolvers/transition", function () {

    for (let [name, timeout]  of [['slideRight', 500], ['slideLeft', 500], ['rollUp', 800]]) {
        it(`should load transistion ${name} with timeout ${timeout}`, function () {
            const {
                transitionHeightClass,
                transitionAppearTimeout,
                transitionLeaveTimeout,
                transitionEnterTimeout,
                transitionName:{
                    enter, enterActive, leave, leaveActive, appear, appearActive
                    }} = loader.loadTransition(name);
            expect(enter).toExist('enter');
            expect(leave).toExist('leave');
            expect(appear).toExist('appear');
            expect(enterActive).toExist('enterActive');
            expect(leaveActive).toExist('leaveActive');
            expect(appearActive).toExist('appearActive');
            expect(transitionAppearTimeout).toBe(timeout, 'transitionAppearTimeout');
            expect(transitionLeaveTimeout).toBe(timeout, 'transitionleaveTimeout');
            expect(transitionEnterTimeout).toBe(timeout, 'transitionEnterTimeout');
            expect(transitionHeightClass).toExist('transitionHeightClass');
        });
    }

    it('should resolve transition, slideLeft no appear', function () {
        const timeout = 500;
        const {
            transitionHeightClass,
            transitionAppearTimeout,
            transitionLeaveTimeout,
            transitionEnterTimeout,
            transitionName:{
                enter, enterActive, leave, leaveActive, appear, appearActive
                }} =  transition.handleTransition('slideLeft', 'stuff', {}, {loader});

        expect(enter).toExist('enter');
        expect(leave).toExist('leave');
        expect(appear).toNotExist('appear');
        expect(enterActive).toExist('enterActive');
        expect(leaveActive).toExist('leaveActive');
        expect(appearActive).toNotExist('appearActive');
        expect(transitionAppearTimeout).toNotExist('transitionAppearTimeout');
        expect(transitionLeaveTimeout).toBe(timeout, 'transitionleaveTimeout');
        expect(transitionEnterTimeout).toBe(timeout, 'transitionEnterTimeout');
        expect(transitionHeightClass).toExist('transitionHeightClass');

    });
    it('should resolve transition, slideLeft with appear', function () {
        const timeout = 500;
        const {
            transitionHeightClass,
            transitionAppearTimeout,
            transitionLeaveTimeout,
            transitionEnterTimeout,
            transitionName:{
                enter, enterActive, leave, leaveActive, appear, appearActive
                }} =  transition.handleTransition({transition: 'slideLeft', on: ['appear']}, 'stuff', {}, {loader});

        expect(enter).toNotExist('enter');
        expect(leave).toNotExist('leave');
        expect(appear).toExist('appear');
        expect(enterActive).toNotExist('enterActive');
        expect(leaveActive).toNotExist('leaveActive');
        expect(appearActive).toExist('appearActive');
        expect(transitionAppearTimeout).toExist(timeout, 'transitionAppearTimeout');
        expect(transitionLeaveTimeout).toNotExist('transitionleaveTimeout');
        expect(transitionEnterTimeout).toNotExist('transitionEnterTimeout');
        expect(transitionHeightClass).toExist('transitionHeightClass');

    });
    it('should resolve transition, slideLeft with appear with custom timeout', function () {
        const timeout = 200;
        const {
            transitionHeightClass,
            transitionAppearTimeout,
            transitionLeaveTimeout,
            transitionEnterTimeout,
            transitionName:{
                enter, enterActive, leave, leaveActive, appear, appearActive
                }} =  transition.handleTransition({
            transition: 'slideLeft',
            transitionAppearTimeout: timeout,
            on: ['appear']
        }, 'stuff', {}, {loader});

        expect(enter).toNotExist('enter');
        expect(leave).toNotExist('leave');
        expect(appear).toExist('appear');
        expect(enterActive).toNotExist('enterActive');
        expect(leaveActive).toNotExist('leaveActive');
        expect(appearActive).toExist('appearActive');
        expect(transitionAppearTimeout).toExist(timeout, 'transitionAppearTimeout');
        expect(transitionLeaveTimeout).toNotExist('transitionleaveTimeout');
        expect(transitionEnterTimeout).toNotExist('transitionEnterTimeout');
        expect(transitionHeightClass).toExist('transitionHeightClass');

    });

});