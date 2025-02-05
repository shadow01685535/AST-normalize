/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Controller for our home(index) page.
 */
angular.module('sb.dashboard').controller('HomeController',
    function ($state, sessionState, SessionState) {
        'use strict';

        // If we're logged in, go to the dashboard instead.
        if (sessionState === SessionState.LOGGED_IN) {
            $state.go('sb.dashboard');
        }
    });
